"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Box, Typography, Paper, IconButton, useTheme } from "@mui/material";

import { Delete } from "@mui/icons-material";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";

type InputFileProps = {
	id?: string;
  watch: UseFormWatch<any>;
	setValue: UseFormSetValue<any>;
	control: Control<any>;
};

const InputFile = ({ id, control, watch, setValue }: InputFileProps) => {
  const theme = useTheme();

	const files = watch("files");

	const onDrop = useCallback(
		(acceptedFiles: any) => {
			const newFiles = [...(files || []), ...acceptedFiles].slice(0, 10);
			setValue("files", newFiles, { shouldValidate: true });
		},
		[files, setValue]
	);

	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
		onDrop,
		maxFiles: 10, // max 10 files
		accept: {
			"application/pdf": [],
			"image/png": [],
			"image/jpeg": [],
		},
	});

	const removeFile = (fileName: string) => {
		setValue(
			"files",
			files.filter((file: any) => file.name !== fileName),
			{ shouldValidate: true }
		);
	};

	return (
		<>
			<Controller				
				control={control}
				name="files"
				render={() => (
					<Paper
						{...getRootProps()}
						sx={{
							textAlign: "center",
							bgcolor: isDragActive ? "action.hover" : "background.paper",
              border: "1px dashed",
							borderColor: isDragActive ? "primary.main" : "grey.400",
							borderRadius: 2,
							cursor: "pointer",
							transition: "0.2s",
              boxShadow: "none",
							paddingX: { xs: 5, md: 10 },
              paddingY: 10,
						}}>
						<input id={id} {...getInputProps()} />
						<Typography variant="body1" color={theme.palette.text.disabled}>
              {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select (max 10 files)"}
            </Typography>
					</Paper>
				)}
      />

			{/* Preview thumbnails */}
			{files && files.length > 0 && (
				<Box 
          sx={{
            display: "grid", gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(150px, 1fr))',
            },
            marginTop: 2,
          }}
        >
					{files.map((file: any) => (
						<Box 
              key={file.name} 
              sx={{ 
                position: "relative", 
                width: "100%", 
                maxHeight: 150,
                border: "1px solid #CCCCCC",  
                borderRadius: 2, 
                overflow: "hidden" 
              }}
            >
							{file.type.startsWith("image/") ? (
								<img 
                  src={URL.createObjectURL(file)} alt={file.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
							) : (
								<Box 
                  sx={{ 
                    height: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    padding: 1, 
                  }}
                >
									<Typography variant="caption">{file.name}</Typography>
								</Box>
							)}

							{/* Delete file */}
							<IconButton
								size="small"
								onClick={() => removeFile(file.name)}
								sx={{
                  position: "absolute",
									top: 3, 
                  right: 3,
									bgcolor: "rgba(255,255,255,0.8)",
									"&:hover": { bgcolor: "error.main", color: "white" },
								}}>
								<Delete fontSize="small" />
							</IconButton>
						</Box>
					))}
				</Box>
			)}
		</>
	);
};

export default InputFile;
