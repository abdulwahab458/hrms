import Overtime from "../models/OvertimeModel.js";
import DataPegawai from "../models/DataPegawaiModel.js";
import { Op } from 'sequelize';

// POST /api/overtime
export const createOvertime = async (req, res) => {
    try {
        const { employeeId, date, hours, reason } = req.body;

        // Required fields
        if (!employeeId || !date || hours === undefined || !reason) {
            return res.status(400).json({ msg: "employeeId, date, hours and reason are required" });
        }

        // hours validation
        const hrs = parseInt(hours, 10);
        if (isNaN(hrs) || hrs < 1 || hrs > 6) {
            return res.status(400).json({ msg: "hours must be an integer between 1 and 6" });
        }

        const providedDate = new Date(date + 'T00:00:00');
        const today = new Date();
        const startPastLimit = new Date();
        startPastLimit.setDate(startPastLimit.getDate() - 7);

        // date not in future
        if (providedDate > new Date(today.toDateString())) {
            return res.status(400).json({ msg: "date cannot be in the future" });
        }

        // date not more than 7 days in past
        if (providedDate < new Date(startPastLimit.toDateString())) {
            return res.status(400).json({ msg: "date cannot be more than 7 days in the past" });
        }

        // reason length
        if (typeof reason !== 'string' || reason.trim().length < 10) {
            return res.status(400).json({ msg: "reason must be at least 10 characters" });
        }

        // employee exists
        const employee = await DataPegawai.findOne({ where: { id_pegawai: employeeId } });
        if (!employee) {
            return res.status(404).json({ msg: "employee not found" });
        }

        // check duplicate for same employee + date
        const existing = await Overtime.findOne({ where: { employee_id: employeeId, date: date } });
        if (existing) {
            return res.status(409).json({ msg: "Overtime for this employee on this date already exists" });
        }

        // calculate month limits (month of provided date)
        const year = providedDate.getFullYear();
        const month = providedDate.getMonth();
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

        const totalThisMonth = await Overtime.sum('hours', {
            where: {
                employee_id: employeeId,
                date: {
                    [Op.between]: [monthStart.toISOString().slice(0,10), monthEnd.toISOString().slice(0,10)]
                }
            }
        }) || 0;

        if ((totalThisMonth + hrs) > 60) {
            return res.status(400).json({ msg: "Total overtime for the month would exceed 60 hours" });
        }

        // create
        await Overtime.create({
            employee_id: employeeId,
            date: date,
            hours: hrs,
            reason: reason.trim()
        });

        return res.status(201).json({ msg: "Overtime recorded successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

export default { createOvertime };
