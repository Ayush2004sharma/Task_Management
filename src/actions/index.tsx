"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export async function createTodo(formData: FormData) {
  const input = formData.get("input") as string;
  if (!input?.trim()) {
    throw new Error("Input cannot be empty");
  }

  try {
    await prisma.todo.create({
      data: {
        title: input,
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to create todo");
  }
}

export async function changeStatus(formData: FormData) {
  const inputId = formData.get("inputId") as string;
  
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: inputId,
      },
    });

    if (!todo) {
      throw new Error("Todo not found");
    }

    await prisma.todo.update({
      where: {
        id: inputId,
      },
      data: {
        isCompleted: !todo.isCompleted,
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to update status");
  }
}

export async function editTodo(formData: FormData) {
  const newTitle = formData.get("newTitle") as string;
  const inputId = formData.get("inputId") as string;

  if (!newTitle?.trim()) {
    throw new Error("Title cannot be empty");
  }

  try {
    await prisma.todo.update({
      where: {
        id: inputId,
      },
      data: {
        title: newTitle,
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to edit todo");
  }
}

export async function deleteTodo(formData: FormData) {
  const inputId = formData.get("inputId") as string;

  try {
    await prisma.todo.delete({
      where: {
        id: inputId,
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Todo not found or already deleted");
  }
}