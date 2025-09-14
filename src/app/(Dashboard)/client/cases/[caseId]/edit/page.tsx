"use client";
import { useParams } from "next/navigation";
import UpsertCases from "../../components/UpsertCase";

const EditCases = () => {
  const { caseId } = useParams();
  return <UpsertCases caseId={caseId as string} />
};

export default EditCases;