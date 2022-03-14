import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../database";
import { Entry, IEntry } from "../../../../models";

type Data =
  | {
      message: string;
    }
  | IEntry;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "PUT":
      return updateEntry(req, res);

    case "GET":
      return getEntry(req, res);

    default:
      return res.status(400).json({ message: "Pelo bolas" });
  }
}

const updateEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    await db.connect();

    const entryToUpdate = await Entry.findById(id);

    if (!entryToUpdate) {
      return res.status(400).json({ message: "No existe entrada con ese ID" });
    }

    const {
      description = entryToUpdate.description,
      status = entryToUpdate.status,
    } = req.body;

    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      {
        description,
        status,
      },
      { runValidators: true, new: true }
    );

    await db.disconnect();

    return res.status(200).json(updatedEntry!);
  } catch (error) {
    console.log(error);

    await db.disconnect();

    return res.status(400).json({ message: "Fail" });
  }
};

const getEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    await db.connect();

    const entry = await Entry.findById(id);

    if (!entry) {
      return res.status(400).json({ message: "No existe entrada con ese ID" });
    }

    await db.disconnect();

    return res.status(200).json(entry!);
  } catch (error) {
    console.log(error);

    await db.disconnect();

    return res.status(400).json({ message: "Fail" });
  }
};
