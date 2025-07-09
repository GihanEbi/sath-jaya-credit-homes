import { NextResponse } from 'next/server';

// -------------services-----------------
import { connectDB } from '../../../../../lib/db';
import RuleModel from '../../../../../models/RuleModel';
import GroupRuleModel from '../../../../../models/GroupRuleModel';
import { createId } from '@/services/id_generator/id-generator-service';
import { id_codes } from '@/constants/id_code_constants';
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
  const { groupId, newList, deleteList } = await req.json();

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
      access_levels.AssignGroupRule
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
  let createdObject;

  try {
    for await (const item of deleteList) {
      let deletedObject = await GroupRuleModel.findOneAndDelete({
        groupId: groupId,
        ruleId: item,
      });
    }

    for await (const item of newList) {
      let existingObj = await GroupRuleModel.findOne({
        groupId: groupId,
        ruleId: item,
      });
      if (existingObj) {
        continue;
      }
      let ID = await createId(id_codes.idCode.groupRule);

      createdObject = await GroupRuleModel.create({
        ID: ID,
        groupId: groupId,
        ruleId: item,
        userCreated: isValidToken.userId,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Group rule assigned successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error assigning group rule' },
      { status: 500 }
    );
  }
}
