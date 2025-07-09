import { NextResponse } from 'next/server';

// -------------services-----------------
import { connectDB } from '../../../../../lib/db';
import RuleModel from '../../../../../models/RuleModel';
import { createId } from '@/services/id_generator/id-generator-service';
import { id_codes } from '@/constants/id_code_constants';
import { CheckUserAccess } from '@/services/auth services/auth-service';
import { access_levels } from '@/constants/access_constants';

type isValidTokenTypes = {
  success: boolean;
  access: string;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { ID, name, description } = await req.json();

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
    access_levels.AddGroupRule
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

  // ------------ Check if user group already exists -----------
  const existingGroupRule = await RuleModel.find({
    name,
  });

  if (existingGroupRule.length !== 0) {
    return NextResponse.json({
      success: false,
      message: 'Group rule name already exists',
      status: 409,
    });
  }

  // ----------- create created user details -----------
  let createdGroupRule;

  try {
    createdGroupRule = new RuleModel({
      ID,
      name,
      description,
      userCreated: isValidToken.userId, // Assuming userId is available in the token
    });

    await createdGroupRule.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Group rule added successfully',
        data: createdGroupRule,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error adding group rule' },
      { status: 500 }
    );
  }
}
