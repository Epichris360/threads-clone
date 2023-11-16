"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/Thread.model";
import User from "../models/User.model";
import { connectToDB } from "../mongoose"

type Params = {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text, author, community: null
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    })

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Error creating thread: ${e.message}`) 
  }
}