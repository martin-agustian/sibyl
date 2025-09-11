import { Box } from "@mui/system";
import { IconButton, Typography } from "@mui/material";

import { FileModel } from "@/types/model/File";
import { Download } from "@mui/icons-material";

type FilePreviewProps = {
	files: FileModel[];
  onActionClick: (file: FileModel) => void;
};

const FilePreview = ({ files, onActionClick }: FilePreviewProps) => {
	return (
		<Box
			sx={{
				display: "grid",
				gap: 2,
				gridTemplateColumns: {
					xs: "1fr",
					sm: "repeat(auto-fill, minmax(150px, 1fr))",
				},
				marginTop: 2,
			}}>
        {files.map((file: FileModel) => (
          <Box
            key={file.originalName}
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: 150,
              border: "1px solid #CCCCCC",
              borderRadius: 2,
              overflow: "hidden",
            }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 1,
                }}>
                  <Typography 
                    variant="caption"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: { xs: 1, md: 4 },
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {file.originalName}
                  </Typography>
              </Box>

              <IconButton
								size="small"
								onClick={() => onActionClick(file)}
								sx={{
                  position: "absolute",
									top: 3, 
                  right: 3,
									bgcolor: "rgba(255,255,255,0.8)",
									"&:hover": { bgcolor: "primary.main", color: "white" },
								}}
              >
                <Download fontSize="small" />
							</IconButton>
          </Box>
        ))}
		</Box>
	);
};

export default FilePreview;
