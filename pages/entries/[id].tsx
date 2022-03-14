import {
  Grid,
  CardHeader,
  Card,
  CardContent,
  TextField,
  CardActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  capitalize,
  IconButton,
} from "@mui/material";
import React, { ChangeEvent, FC, useMemo, useState, useContext } from "react";
import { Layout } from "../../components/layouts/Layout";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { EntryStatus } from "../../interfaces";
import { GetServerSideProps } from "next";
import { dbEntries } from "../../database";
import { Entry } from "../../interfaces/entry";
import { EntriesContext } from "../../context/entries/EntriesContext";
import { useSnackbar } from "notistack";
import { dateFunctions } from "../../utils";

const validStatus: EntryStatus[] = ["pending", "in-progress", "finished"];

interface Props {
  entry: Entry;
}

const EntryPage: FC<Props> = ({ entry }) => {
  const { updateEntry } = useContext(EntriesContext);

  const [inputValue, setInputValue] = useState(entry.description);

  const [status, setStatus] = useState<EntryStatus>("pending");

  const [touched, setTouched] = useState(false);

  const isInvalid = useMemo(
    () => inputValue.length <= 0 && touched,
    [inputValue, touched]
  );

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as EntryStatus);
  };

  const onSave = () => {
    if (inputValue.trim().length === 0) return;

    const updatedEntry: Entry = {
      ...entry,
      status,
      description: inputValue,
    };
    updateEntry(updatedEntry, true);
  };

  return (
    <Layout title={(inputValue.substring(0, 10), "...")}>
      <Grid container justifyContent={"center"} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader
              title={`Entrada ${inputValue}`}
              subheader={`Creada ${dateFunctions.getFormatDistanceToNow(
                entry.createdAt
              )} `}
            />

            <CardContent>
              <TextField
                sx={{ marginTop: 2, marginBottom: 1 }}
                fullWidth
                placeholder="Nueva entrada"
                autoFocus
                multiline
                label="Nueva entrada"
                value={inputValue}
                onChange={onTextChange}
                helperText={isInvalid && "Ingrese un valor"}
                onBlur={() => {
                  setTouched(true);
                }}
                error={isInvalid}
              />

              <FormControl>
                <FormLabel>Status:</FormLabel>
                <RadioGroup row value={status} onChange={onStatusChange}>
                  {validStatus.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={capitalize(option)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<SaveOutlinedIcon />}
                variant="contained"
                fullWidth
                onClick={onSave}
                disabled={inputValue.length <= 0}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <IconButton
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          backgroundColor: "error.dark",
        }}
      >
        <DeleteOutlineOutlinedIcon />
      </IconButton>
    </Layout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params as { id: string };

  const entry = await dbEntries.getEntryById(id);

  if (!entry) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { entry },
  };
};

export default EntryPage;
