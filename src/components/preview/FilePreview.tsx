import { useState } from "react";

import { Box } from "@mui/system";
import { IconButton, Typography } from "@mui/material";

import { FileModel } from "@/types/model/File";
import { Delete, Download } from "@mui/icons-material";

type FilePreviewProps = {
  loadingText?: string;
  loadingAction?: boolean;
	files: FileModel[];
  actionType?: "DOWNLOAD" | "DELETE";
  onActionClick: (file: FileModel) => void;
  onBoxClick: (file: FileModel) => void;
};

const FilePreview = ({ 
  loadingText, loadingAction, files, actionType = "DOWNLOAD", 
  onActionClick, onBoxClick 
}: FilePreviewProps) => {
  const [selectedFile, setSelectedFile] = useState<FileModel>();

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
            onClick={() => {
              onBoxClick(file);
              setSelectedFile(file);
            }}
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: 150,
              border: "1px solid #CCCCCC",
              borderRadius: 2,
              overflow: "hidden",
              "&:hover": { 
                borderColor: "primary.main",
                cursor: "pointer" 
              }
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
                    {loadingText && selectedFile?.id == file.id ? loadingText : file.originalName}
                  </Typography>
              </Box>

              {actionType === "DELETE" ? (
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onActionClick(file);}}
                  loading={loadingAction}
                  sx={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    bgcolor: "rgba(255,255,255,0.8)",
                    "&:hover": { bgcolor: "error.main", color: "white" },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onActionClick(file);}}
                  loading={loadingAction}
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
              )}
          </Box>
        ))}
		</Box>
	);
};

export default FilePreview;
