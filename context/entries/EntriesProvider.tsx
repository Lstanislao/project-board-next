import { FC, useEffect, useReducer } from "react";
import { EntriesContext } from "./EntriesContext";
import { Entry } from "../../interfaces/entry";
import { entriesReducer } from ".";
import entriesApi from "../../apis/entriesApi";
import { useSnackbar } from "notistack";

export interface EntriesState {
  entries: Entry[];
}

const initialState: EntriesState = {
  entries: [],
};

export const EntriesProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  const addNewEntry = async (description: string) => {
    try {
      const { data } = await entriesApi.post<Entry>("/entries", {
        description,
      });
      dispatch({ type: "[Entry] - Add-Entry", payload: data });
    } catch (error) {
      console.log("error");
    }
  };

  const updateEntry = async (
    { description, status, _id }: Entry,
    showSnackBar = false
  ) => {
    try {
      const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, {
        description,
        status,
      });
      dispatch({
        type: "[Entry] - Entry-Updated",
        payload: data,
      });
      showSnackBar &&
        enqueueSnackbar("Entrada actualizada", {
          variant: "success",
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
    } catch (error) {
      console.log(error);
    }
  };

  const refreshEntries = async () => {
    const { data } = await entriesApi.get<Entry[]>("/entries");
    dispatch({ type: "[Entry] - Refresh-Data", payload: data });
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntriesContext.Provider value={{ ...state, addNewEntry, updateEntry }}>
      {children}
    </EntriesContext.Provider>
  );
};
