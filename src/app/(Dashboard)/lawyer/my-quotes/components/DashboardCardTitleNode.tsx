import { Dispatch, SetStateAction } from "react";

import DashboardCardTitle from "@/app/(Dashboard)/components/shared/DashboardCardTitle";

import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Stack } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

import InputText from "@/components/form/InputText";
import Label from "@/components/form/Label";
import InputSelect from "@/components/form/InputSelect";

import { lawCategoryOptions, sortOptions } from "@/commons/options";
import { Control, UseFormHandleSubmit, UseFormRegister, UseFormReset } from "react-hook-form";
import { QuoteStatusEnum } from "@/commons/enum";

export type FilterSchema = {
  title: string,
  category: string,
  status: string[],
  sortBy: string,
};

type DashboardCardTitleNodeProps = {
	title?: string;
  openFilter: boolean;
  setOpenFilter: Dispatch<SetStateAction<boolean>>;
  handleCloseFilter: () => void;
  controlFilter: Control<any>,
  registerFilter: UseFormRegister<FilterSchema>;
  resetFilter: UseFormReset<FilterSchema>;
  onSubmitFilter: UseFormHandleSubmit<FilterSchema>;
  handleSubmitFilter: (data: FilterSchema) => void;  
};

const DashboardCardTitleNode = ({ 
  title, openFilter, setOpenFilter, handleCloseFilter, 
  controlFilter, registerFilter, resetFilter, onSubmitFilter, handleSubmitFilter,
}: DashboardCardTitleNodeProps) => {
	return (
		<>
			<Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
				<DashboardCardTitle>{title}</DashboardCardTitle>

				<Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
					<IconButton size="small" color="primary" onClick={() => setOpenFilter(true)}>
						<FilterAlt fontSize="small"></FilterAlt>
					</IconButton>
				</Stack>
			</Stack>

			<Dialog open={openFilter} onClose={handleCloseFilter}>
        <form onSubmit={onSubmitFilter(handleSubmitFilter)}>
          <DialogTitle>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              Filter
              <Button variant="text" size="small" onClick={() => resetFilter()}>
                Reset
              </Button>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Label htmlFor="title">Title</Label>
                <InputText id="title" placeholder="Enter Title" {...registerFilter("title")} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Label htmlFor="category">Category</Label>
                <InputSelect id="category" placeholder="Select Category" control={controlFilter} name="category" items={lawCategoryOptions} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Label htmlFor="category">Status</Label>
                <FormControlLabel label="Proposed" control={<Checkbox value={QuoteStatusEnum.PROPOSED} {...registerFilter("status")} />} />
                <FormControlLabel label="Accepted" control={<Checkbox value={QuoteStatusEnum.ACCEPTED} {...registerFilter("status")} />} />
                <FormControlLabel label="Rejected" control={<Checkbox value={QuoteStatusEnum.REJECTED} {...registerFilter("status")} />} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Label htmlFor="sort">Sort By</Label>
                <InputSelect id="sort" placeholder="Select Sort By" control={controlFilter} name="sortBy" items={sortOptions} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button variant="outlined" type="button" onClick={() => setOpenFilter(false)} sx={{ width: 100, fontWeight: "bold" }}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" sx={{ width: 100, fontWeight: "bold" }}>
              Filter
            </Button>
          </DialogActions>
        </form>
			</Dialog>
		</>
	);
};

export default DashboardCardTitleNode;
