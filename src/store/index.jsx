import { configureStore } from '@reduxjs/toolkit';

import buildingsReducer from './slices/buildingsSlice';
import departmentReducer from './slices/departmentSlice';
import designateReducer from './slices/designateSlice';
import doctorReducer from './slices/doctorSlice';
import expensesReducer from './slices/expensesSlice';
import floorReducer from './slices/floorSlice';
import medicineReducer from './slices/medicineSlice';
import patientReducer from './slices/patientSlice';
import prescriptionReducer from './slices/prescriptionSlice';
import specializeReducer from './slices/specializeSlice';
import testReducer from './slices/testSlice';
import treatmentReducer from './slices/treatmentSlice';
import userReducer from './slices/userSlice';
import vaccineAppointmentReducer from './slices/vaccineAppointmentSlice';
import vaccineCatReducer from './slices/vaccineCatSlice';
import vendorsReducer from './slices/vendorsSlice';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const preloadedState = {
  userLogin: { userInfo: userInfoFromStorage }
}

// === root reducer combining all slices ===
const rootReducer = {
  buildings: buildingsReducer,
  departments: departmentReducer,
  designate: designateReducer,
  doctor: doctorReducer,
  expense: expensesReducer,
  floor: floorReducer,
  medicine: medicineReducer,
  patients: patientReducer,
  prescription: prescriptionReducer,
  specialize: specializeReducer,
  test: testReducer,
  treatment: treatmentReducer,
  users: userReducer,
  vaccineAppointments: vaccineAppointmentReducer,
  vaccineCat: vaccineCatReducer,
  vendors: vendorsReducer,
};


// === configure store ===
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
})

export default store
