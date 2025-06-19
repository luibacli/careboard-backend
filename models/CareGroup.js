import mongoose from 'mongoose';

const CareGroupSchema = new mongoose.Schema({
  client_name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  province: { type: String },
  main: { 
    type: String, 
    enum: ['Luzon', 'Visayas', 'Mindanao'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  }
}, {
  timestamps: true
});

export default mongoose.model('CareGroup', CareGroupSchema);
