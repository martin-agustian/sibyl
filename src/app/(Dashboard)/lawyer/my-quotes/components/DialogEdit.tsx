import Swal from "sweetalert2";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Box, Button, Dialog, DialogContent, Grid, Typography } from "@mui/material";

import Label from "@/components/form/Label";
import InputText from "@/components/form/InputText";
import HelperTextError from "@/components/form/HelperTextError";
import InputTextArea from "@/components/form/InputTextArea";

import { QuoteModel } from "@/types/model/Quote";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertQuoteSchema, UpsertQuoteSchema } from "@/schemas/quote/upsertQuotes";

type DialogEditProps = {
  caseId: string;
  quote?: QuoteModel;
  fetchQuotes: () => Promise<void>;
  open: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  onDialogClose: () => void;
};

const DialogEdit = ({ caseId, quote, fetchQuotes, open, setOpenDialog, onDialogClose }: DialogEditProps) => {

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const {
    watch: watchQuote,
    getValues: getValueQuote,
    setValue: setValueQuote,    
    control: controlQuote,
    register: registerQuote,
    handleSubmit: onSubmitQuote,
    formState: { errors: caseQuote },
  } = useForm<UpsertQuoteSchema>({
    resolver: zodResolver(upsertQuoteSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (quote?.amount) setValueQuote("amount", quote.amount.toString());
    if (quote?.expectedDays) setValueQuote("expectedDays", quote.expectedDays.toString());
    if (quote?.note) setValueQuote("note", quote.note.toString());
  }, [quote]);

  const handleSubmitQuote = async (data: UpsertQuoteSchema) => {
    try {
      if (!caseId || !quote?.id) return;
      
      setLoadingSubmit(true);

      const response = await fetch(`/api/lawyer/marketplace/cases/${caseId}/quotes/${quote?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(data.amount),
          expectedDays: Number(data.expectedDays),
          note: data.note,
        }),
      });
      const responseData = await response.json();

      if (response.ok) {
        setOpenDialog(false);
        fetchQuotes();

        await Swal.fire({
          title: "Success!",
          icon: "success",
          text: "Success submit edit quote",
        });
      } 
      else throw new Error(responseData.error);

      setLoadingSubmit(false);			
    } catch (error) {
      setLoadingSubmit(false);
      await Swal.fire({
        title: "Error!",
        icon: "error",
        text: error instanceof Error ? error.message : (error as string),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onDialogClose}>
      <DialogContent>
        <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", marginBottom: 3 }}>
          Submit Quotation
        </Typography>

        <form onSubmit={onSubmitQuote(handleSubmitQuote)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label htmlFor="amount">Amount</Label>
              <InputText id="amount" type="number" placeholder="Enter Amount" {...registerQuote("amount")} />

              {caseQuote?.amount?.message && <HelperTextError>{caseQuote.amount.message}</HelperTextError>}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Label htmlFor="expected-days">Expected Days</Label>
              <InputText id="expected-days" type="number" placeholder="Enter Expected Days" {...registerQuote("expectedDays")} />

              {caseQuote?.expectedDays?.message && <HelperTextError>{caseQuote.expectedDays.message}</HelperTextError>}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Label htmlFor="note">Note</Label>
              <InputTextArea id="note" placeholder="Enter Note" {...registerQuote("note")} />

              {caseQuote?.note?.message && <HelperTextError>{caseQuote.note.message}</HelperTextError>}
            </Grid>
          </Grid>
          <Box sx={{ marginTop: "25px" }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              size="medium"
              loading={loadingSubmit}
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                minWidth: 120,
                width: {
                  xs: "100%",
                  md: "auto",
                },
              }}>
              Submit
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEdit;
