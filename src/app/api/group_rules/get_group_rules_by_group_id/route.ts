import { NextResponse } from 'next/server';

// -------------services-----------------
import { connectDB } from '../../../../../lib/db';
import RuleModel from '../../../../../models/RuleModel';
import { CheckUserAccess } from '@/services/auth services/auth-service';
import { access_levels } from '@/constants/access_constants';

type isValidTokenTypes = {
  success: boolean;
  access: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { groupId } = await req.json();

  // ----------- check if the token provided in headers -----------
  const tokenString = req.headers.get('token');
  if (!tokenString) {
    return NextResponse.json(
      { success: false, message: 'Token is required' },
      { status: 401 }
    );
  }
      const checkResult = await CheckUserAccess(
        tokenString,
        access_levels.GetGroupRules
      );
      const isValidToken: isValidTokenTypes = {
        success: checkResult.success,
        access: checkResult.access ?? '',
        userId: checkResult.userId,
      };
    
      if (!isValidToken.success) {
        return NextResponse.json(
          { success: isValidToken.success, message: 'Unauthorized' },
          { status: 403 }
        );
      }

  //   --------- connect to database -----------
  await connectDB();

  let createdGroupRule;
  try {
    createdGroupRule = await RuleModel.aggregate([
      {
        $lookup: {
          from: 'group_rules',
          let: {
            userRule: '$ID',
            groupId: groupId,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$ruleId', '$$userRule'] },
                    { $eq: ['$groupId', '$$groupId'] },
                  ],
                },
              },
            },
          ],
          as: 'group_rules',
        },
      },
      {
        $project: {
          ID: 1,
          description: 1,
          groupId: { $first: '$group_rules.groupId' },
        },
      },
      {
        $group: {
          _id: '$groupId',
          rules: {
            $push: {
              ID: '$ID',
              description: '$description',
            },
          },
        },
      },
      {
        $project: {
          accessType: {
            $cond: { if: '$_id', then: 'assign', else: 'notAssign' },
          },
          rules: 1,
        },
      },
      {
        $group: {
          _id: '$accessType',
          rules: { $push: '$rules' },
        },
      },
      {
        $project: {
          _id: 0,
          accessType: '$_id',
          rules: { $arrayElemAt: ['$rules', 0] },
        },
      },
    ]);
    // return the output value
    return Response.json(
      { success: true, message: 'User groups data', Details: createdGroupRule },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: 'Error fetching user group rules' },
      { status: 400 }
    );
  }
}
