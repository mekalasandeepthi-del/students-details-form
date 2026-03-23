import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addStudent, deleteStudent, updateStudent, setStudents } from "./redux/studentSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentForm() {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "http://localhost:5000/students";

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      dispatch(setStudents(response.data));
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const resetForm = () => {
    setName("");
    setAge("");
    setCourse("");
    setEditId(null);
  };

  const handleAddOrUpdate = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!name || !age || !course) {
      toast.warning("Please fill all fields");
      return;
    }

    const studentData = {
      name,
      age,
      course,
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, studentData);

        dispatch(
          updateStudent({
            id: editId,
            ...studentData,
          })
        );

        toast.info("Student updated successfully!");
      } else {
        const response = await axios.post(API_URL, studentData);
        dispatch(addStudent(response.data));
        toast.success("Student saved successfully!");
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      dispatch(deleteStudent(id));
      toast.error("Student deleted");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setAge(student.age);
    setCourse(student.course);
    setEditId(student.id);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      `${student.name} ${student.age} ${student.course}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const totalStudents = students.length;
  const totalCourses = new Set(students.map((student) => student.course)).size;
  const averageAge =
    students.length > 0
      ? (
          students.reduce((sum, student) => sum + Number(student.age || 0), 0) /
          students.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold">Student Management Dashboard</h1>
          <p className="mt-2 text-slate-200">
            Add, edit, view, and manage student records professionally.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-slate-500">Total Students</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {totalStudents}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-slate-500">Courses</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {totalCourses}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-slate-500">Average Age</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {averageAge}
            </h2>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-2xl font-semibold text-slate-800">
                Add Student
              </h2>

              <form onSubmit={handleAddOrUpdate} className="space-y-4">
                <input
                  className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  type="number"
                  placeholder="Enter Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />

                <input
                  className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  type="text"
                  placeholder="Enter Course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
                  >
                    Add Student
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Student Records
                </h2>

                <input
                  type="text"
                  placeholder="Search by name, age, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none md:w-80"
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800"></div>
                  <p className="mt-4 text-slate-500">Loading student data...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
                  <p className="text-lg font-medium text-slate-600">
                    No student records found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full overflow-hidden rounded-2xl">
                    <thead>
                      <tr className="bg-slate-900 text-left text-sm uppercase tracking-wider text-white">
                        <th className="px-5 py-4">No.</th>
                        <th className="px-5 py-4">Name</th>
                        <th className="px-5 py-4">Age</th>
                        <th className="px-5 py-4">Course</th>
                        <th className="px-5 py-4 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={student.id}
                          className="border-b border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">{index + 1}</td>

                          <td className="px-5 py-4">
                            {editId === student.id ? (
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                              />
                            ) : (
                              student.name
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {editId === student.id ? (
                              <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                              />
                            ) : (
                              student.age
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {editId === student.id ? (
                              <input
                                type="text"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                              />
                            ) : (
                              student.course
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-center gap-2">
                              {editId === student.id ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={handleAddOrUpdate}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                  >
                                    Save
                                  </button>

                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="rounded-lg bg-slate-500 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleEdit(student)}
                                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDelete(student.id)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default StudentForm;

