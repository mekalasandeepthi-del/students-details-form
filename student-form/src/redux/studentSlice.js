import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "students",
  initialState: [],
  reducers: {
    setStudents: (state, action) => {
      return action.payload;
    },

    addStudent: (state, action) => {
      state.push(action.payload);
    },

    deleteStudent: (state, action) => {
      return state.filter((student) => student.id !== action.payload);
    },

    updateStudent: (state, action) => {
      const index = state.findIndex(
        (student) => student.id === action.payload.id
      );

      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setStudents, addStudent, deleteStudent, updateStudent } =
  studentSlice.actions;

export default studentSlice.reducer;