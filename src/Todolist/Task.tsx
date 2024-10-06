import { Button, Box, Typography, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Editable } from "./Editable";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskType } from "../api/todolistApi";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ThunkDispatch } from "redux-thunk";
import { AppStateType } from "../state/store";
import { TodoListActionsType, updateTask } from "../state/todolistReducer";
import { useDispatch } from "react-redux";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export type TaskPropsType = {
  task: TaskType;
  id: string;
  deleteTask: (id: string) => void;
  changeTaskTitle: (title: string, id: string) => void;
};

export const Task: React.FC<TaskPropsType> = React.memo((props) => {
  const dispatch: ThunkDispatch<AppStateType, void, TodoListActionsType> =
    useDispatch();
  const formattedDate = new Date(props.task.addedDate).toLocaleDateString();
  const [selectedDate, setSelectedDate] = useState<Date | null>(props.task.deadline ? new Date(props.task.deadline) : null);
  const [openPicker, setOpenPicker] = useState(false);

  const handleDateChange = (newDate: Date | null) => {
    dispatch(updateTask({ ...props.task, deadline: newDate || props.task.deadline }, props.id, props.task.id));
    setSelectedDate(newDate);
    setOpenPicker(false);
  };

  const handleIncreasePriority = () => {
    dispatch(
      updateTask(
        { ...props.task, priority: props.task.priority + 1 },
        props.id,
        props.task.id
      )
    );
  };
  const handleDecreasePriority = () => {
    dispatch(
      updateTask(
        { ...props.task, priority: props.task.priority - 1 },
        props.id,
        props.task.id
      )
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ padding: "16px", marginBottom: "8px" }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Editable
          deleteItem={props.deleteTask}
          id={props.task.id}
          title={props.task.title}
          changeItem={(title: string) =>
            props.changeTaskTitle(title, props.task.id)
          }
        />
        <Button onClick={() => props.deleteTask(props.task.id)}>
          <DeleteIcon />
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary">
        Added on: {formattedDate}
      </Typography>
      <Editable deleteItem={() => updateTask({...props.task, description: ''}, props.id, props.task.id)} title={props.task.description || 'add description'} changeItem= {(description: string) => {dispatch(updateTask({...props.task, description}, props.id, props.task.id))}} />
      
      <Box display="flex" alignItems="center">
        <Typography variant="body2">Priority: {props.task.priority}</Typography>
        <IconButton>
          <ArrowUpwardIcon onClick={handleIncreasePriority} />
        </IconButton>
        <IconButton>
          <ArrowDownwardIcon onClick={handleDecreasePriority} />
        </IconButton>
      </Box>
      {props.task.deadline ? (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="error">
            Deadline: {new Date(props.task.deadline).toLocaleDateString()}
          </Typography>
          <IconButton onClick={() => setOpenPicker(true)}>
            <CalendarTodayIcon />
          </IconButton>
          <span style={{display: 'none'}}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              open={openPicker}
              onClose={() => setOpenPicker(false)}
              label="Choose deadline"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
          </span>
        </Box>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Choose deadline"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      )}

    </Box>
  );
});
