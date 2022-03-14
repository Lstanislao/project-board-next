import { Box, Button, TextField } from "@mui/material";
import React, { ChangeEvent, useContext, useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { EntriesContext } from "../../context/entries/EntriesContext";
import { UIContext } from "../../context/ui";
export const NewEntry = () => {
  const [inputValue, setInputValue] = useState("");

  const [touched, setTouched] = useState(false);

  const { addNewEntry } = useContext(EntriesContext);

  const { isAddingEntry, setIsAddingEntry } = useContext(UIContext);

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onSaved = () => {
    if (inputValue.length <= 0) return;

    addNewEntry(inputValue);
    setIsAddingEntry(false);
    setTouched(false);
  };

  return (
    <Box sx={{ marginBottom: 2, paddingX: 2 }}>
      {isAddingEntry ? (
        <>
          <TextField
            fullWidth
            sx={{ marginTop: 2, marginBottom: 1 }}
            placeholder="Nueva entrada"
            autoFocus
            multiline
            label="Nueva entrada"
            value={inputValue}
            onChange={onTextChange}
            error={inputValue.length <= 0 && touched}
            onBlur={() => setTouched(true)}
          ></TextField>
          <Box display={"flex"} justifyContent="space-between">
            {" "}
            <Button
              endIcon={<SaveOutlinedIcon />}
              variant="outlined"
              color="secondary"
              onClick={onSaved}
            >
              Guardar
            </Button>
            <Button variant="text" onClick={() => setIsAddingEntry(false)}>
              Cancelar
            </Button>
          </Box>
        </>
      ) : (
        <Button
          startIcon={<AddCircleOutlineOutlinedIcon />}
          fullWidth
          variant="outlined"
          onClick={() => setIsAddingEntry(true)}
        >
          Agregar tarea
        </Button>
      )}
    </Box>
  );
};
