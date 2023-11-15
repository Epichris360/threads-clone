"use server";

import { revalidatePath } from "next/cache";
import User from "../models/User.model";
import { connectToDB } from "../mongoose";

type Props = {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

export async function updateUser(props: Props):Promise<void> {
  try {
    console.log('#####', props)
    connectToDB();
    const {
      userId,
      username,
      name,
      bio,
      image,
      path,
    } = props;

    await User.findOneAndUpdate(
      // This should be clerkId or something
      // but following tutorial as it is
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      { upsert: true }
    )

    if (path === 'profile/edit') {
      revalidatePath(path)
    }

  } catch (e) {
    console.log('--------', e.message)
    throw new Error(`Failed to create/update user: ${(e as Error).message}`)
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB()

    return await User.findOne({ id: userId })
  } catch (e: any) {
    throw new Error(`Failed to fetch user: ${e.message}`)    
  }
}