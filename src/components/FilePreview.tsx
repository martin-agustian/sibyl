import { Box } from "@mui/system";
import { Typography } from "@mui/material";

import { FileModel } from "@/types/model/File";

type FilePreviewProps = {
	files: FileModel[];
};

const FilePreview = ({ files }: FilePreviewProps) => {
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
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {file.originalName}
                  </Typography>
              </Box>
          </Box>
        ))}
		</Box>
	);
};

export default FilePreview;
