import { Dispatch, SetStateAction } from "react";

import DashboardCardTitle from "@/app/(DashboardLayout)/components/shared/DashboardCardTitle";

import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Stack, Typography } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

import InputText from "@/components/form/InputText";
import Label from "@/components/form/Label";
import InputSelect from "@/components/form/InputSelect";

import { lawCategoryOptions, sortOptions } from "@/commons/options";

type DashboardCardTitleNodeProps = {
	title?: string;
	openFilter: boolean;
	setOpenFilter: Dispatch<SetStateAction<boolean>>;
	handleCloseFilter: () => void;
};

const DashboardCardTitleNode = ({ 
  title, openFilter, setOpenFilter, handleCloseFilter,
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
        <DialogTitle>
          Filter
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Label htmlFor="title">Title</Label>
              <InputText id="title" placeholder="Enter Title" />
            </Grid>

            <Grid size={{ xs: 12 }}>
							<Label htmlFor="category">Category</Label>
							<InputSelect id="category" placeholder="Select Category" items={lawCategoryOptions} defaultValue={""} />
						</Grid>

            <Grid size={{ xs: 12 }}>
							<Label htmlFor="category">Status</Label>
              <FormControlLabel label="Open" control={<Checkbox />} />
              <FormControlLabel label="Engaged" control={<Checkbox />} />
              <FormControlLabel label="Closed" control={<Checkbox />} />
              <FormControlLabel label="Cancelled" control={<Checkbox />} />
						</Grid>

            <Grid size={{ xs: 12 }}>
							<Label htmlFor="sort">Sort By</Label>
							<InputSelect id="sort" placeholder="Select Sort By" items={sortOptions} defaultValue={""} />
						</Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenFilter(false)} sx={{ width: 100 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => {}} autoFocus sx={{ width: 100 }}>
            Filter
          </Button>
        </DialogActions>
			</Dialog>
		</>
	);
};

export default DashboardCardTitleNode;
