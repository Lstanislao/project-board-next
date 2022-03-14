import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { disconnect } from "../../../database/db";
import { Entry, IEntry } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IEntry[]
  | IEntry;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getEntries(res);

    case "POST":
      return postEntries(req, res);

    default:
      return res.status(400).json({ message: "Ese endpoint no existe" });
  }
}

const getEntries = async (res: NextApiResponse<Data>) => {
  try {
    await db.connect();

    const entries = await Entry.find().sort({ createdAt: "ascending" });

    await disconnect();

    res.status(200).json(entries);
  } catch (error) {
    console.log(error);
  }
};

const postEntries = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { description = "" } = req.body;

  const newEntry = new Entry({
    description,
    createdAt: Date.now(),
  });
  try {
    await db.connect();
    await newEntry.save();

    await disconnect();

    res.status(200).json(newEntry);
  } catch (error) {
    console.log(error);
    await disconnect();
    res.status(500).json({ message: "Algo salio mal" });
  }
};
