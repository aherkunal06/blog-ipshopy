import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrivacyPolicy {
  id?: number;
  title: string;
  content: string;
  createdDate?: string;
  updatedDate?: string;
}

interface PrivacyPolicyState {
  data: PrivacyPolicy | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrivacyPolicyState = {
  data: null,
  loading: false,
  error: null,
};

// Create Policy
export const createPolicy = createAsyncThunk(
  "privacyPolicy/create",
  async (policy: PrivacyPolicy, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/private-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy),
      });
      if (!res.ok) throw new Error("Failed to create policy");
      return await res.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Policy
export const updatePolicy = createAsyncThunk(
  "privacyPolicy/update",
  async (policy: PrivacyPolicy, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/private-policy/${policy.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy),
      });
      if (!res.ok) throw new Error("Failed to update policy");
      return await res.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const privacyPolicySlice = createSlice({
  name: "privacyPolicy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPolicy.fulfilled, (state, action: PayloadAction<PrivacyPolicy>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePolicy.fulfilled, (state, action: PayloadAction<PrivacyPolicy>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updatePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default privacyPolicySlice.reducer;
