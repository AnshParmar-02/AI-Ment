import mongoose from "mongoose";

const IndustryInsightSchema = new mongoose.Schema({
  industry: { 
    type: String, 
    unique: true, 
    required: true 
},
  salaryRanges: { 
    type: [mongoose.Schema.Types.Mixed], 
    default: [] 
}, // assuming JSON[] from your schema
  growthRate: { 
    type: Number 
},
  demandLevel: { 
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true
},
  topSkills: { 
    type: [String], 
    default: [] 
},
  marketOutlook: { 
    type: String,
    enum: ["Positive", "Negative", "Neutral"],
    required: true 
},
  keyTrends: { 
    type: [String], 
    default: [] 
},
  recommendedSkills: { 
    type: [String], 
    default: [] 
},
  lastUpdated: { 
    type: Date,
    default: Date.now 
},
  nextUpdate: { 
    type: Date 
},

  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const industryInsightModel = mongoose.models.IndustryInsight || mongoose.model("IndustryInsight", IndustryInsightSchema);

export default industryInsightModel;