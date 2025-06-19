import CareGroup from "../models/CareGroup.js";


export const createCareGroup = async (req, res) => {
    try {
      const careGroup = await CareGroup.create(req.body);
        res.status(201).json(careGroup);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

// get all caregroups
export const getAllCareGroups = async (req, res) => {
    try {
        const careGroups = await CareGroup.find();
        if (careGroups.length === 0) return res.status(404).json({ message: 'No care groups found' });
        res.status(200).json(careGroups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// get caregroup by main region

export const getCareGroupsByMain = async (req, res) => {
    try {
        const careGroups = await CareGroup.find({ main: req.params.main });
        if (careGroups.length === 0) return res.status(404).json({ message: 'No care groups found for this region' });
        res.status(200).json(careGroups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  
  
  export const getCareGroup = async (req, res) => {
      try {
        const careGroup = await CareGroup.findById(req.params.id);
        if (!careGroup) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(careGroup);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
  
  export const updateCareGroup = async (req, res) => {
    try {
      const updated = await CareGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  export const deleteCareGroup = async (req, res) => {
    try {
      const deleted = await CareGroup.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Not found' });
      }
      // 204 No Content responses must not include a response body
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };