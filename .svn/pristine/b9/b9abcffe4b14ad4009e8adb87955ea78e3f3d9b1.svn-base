using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FieldToolServices.Models;

using DPWLogSystem;
using System.Configuration;

namespace FieldToolServices
{
    public class FormDataAccess
    {
        private DPWLogger dpwLogger;
        public static string Error;

        public FormDataAccess()
        {
            DPWLogger.Config();
            DPWLogger.SetLogingLevel(ConfigurationManager.AppSettings["LoggerLevel"]);

            if (dpwLogger == null)
            {
                dpwLogger = new DPWLogger(this.GetType().Name);
            }
        }

        #region GetReportData

        public reportFormData getReportFormbyCaseId(int caseId)
        {
            dpwLogger.Info("call Service getReportFormbyCaseId");
            reportFormData ret = new reportFormData();
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {
                // get report case data 
                ret.accidentReport = db.MVAR_AccidentReport
                              .Where(s => s.CaseId == caseId)
                              .FirstOrDefault<MVAR_AccidentReport>();

                ret.charges = db.MVAR_Charges
                              .Where(s => s.CaseId == caseId).ToList();

                ret.vehicles = db.MVAR_Vehicles
                              .Where(s => s.CaseId == caseId).ToList();

                ret.witnesses = db.MVAR_Witnesses
                              .Where(s => s.CaseId == caseId).ToList();

                ret.occupants = db.MVAR_Occupants
                              .Where(s => s.CaseId == caseId).ToList();

            }
            return ret;
        }

        public MVAR_AccidentReport getReportByCaseId(int caseId)
        {
            dpwLogger.Info("call Service getReportCaseNumberCaseId");
            MVAR_AccidentReport report = new MVAR_AccidentReport();
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {
                // get report case data 
                report = db.MVAR_AccidentReport
                              .Where(s => s.CaseId == caseId)
                              .FirstOrDefault<MVAR_AccidentReport>();              
            }
            return report;
        }

        public List<MVAR_AccidentReport> getReportForms()
        {
            dpwLogger.Info("Get all report forms");
            List<MVAR_AccidentReport> accidents = new List<MVAR_AccidentReport>();
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {
                // get all active report cases 
                accidents = db.MVAR_AccidentReport
                    .Where(s => s.CaseStatus == 1).OrderByDescending(a => a.CreateDate).ToList();                              
            }
            return accidents;
        }
        
        
        #endregion

        #region Add/UpdateReportData
        public int AddReportForm(reportFormData formData)
        {
            int accidentCaseId = -1;
            dpwLogger.Info("call Service saveReportForm");
          
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {

                using (var dbContextTransaction = db.Database.BeginTransaction())
                {
                    try
                    {   // insert a report accident                 
                        MVAR_AccidentReport report = formData.accidentReport;
                        var AccidentReportRes = db.MVARReportCase_InsertUpdate(1, accidentCaseId, report.CaseNumber, report.CaseOwner, report.CaseStatus, report.CreateDate, report.LastEditDate,
                            report.CSR_Number, report.DriverSig, report.SupervisorSig, report.SafetyOfficerSig,
                            report.DriverSign_Time, report.SupervisorSig_Time, report.SafetyOfficerSig_Time, report.SupervisorScene_Response, report.SafetyOfficerScene_Reponse,
                            report.PhotoTaken, report.Seatbelt_InUse, report.PCD_Driver_Perm, report.PCD_InUse, report.Control1Call_Time, report.AccidentTime, report.PoliceReport_Number, report.AccidentLocation, report.WeatherCondition,
                            report.VehiclesInvolved_Number, report.Police_Investigation, report.Pedestrian_Involved, report.AccidentDesc, report.IntsSketch).FirstOrDefault();

                        if (AccidentReportRes > 0)
                        {
                            accidentCaseId = (Int32)AccidentReportRes;
                        }

                        // add/update record for charges table                      
                        db.SaveChanges();
                        dbContextTransaction.Commit();
                        return accidentCaseId;

                    }
                    catch (Exception ex)
                    {
                        Error = ex.Message;
                        dpwLogger.Error(Error);
                        dbContextTransaction.Rollback(); //Required according to MSDN article 
                        throw ex;
                    }
                } 
            }
        }

        public int UpdateReportForm(reportFormData formData)
        {
            int accidentCaseId = -1;
            dpwLogger.Info("call Service UpdateReportForm");

            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {

                using (var dbContextTransaction = db.Database.BeginTransaction())
                {
                    try
                    {   
                        accidentCaseId = formData.accidentReport.CaseId;
                        // delete records in accident report table, witness table, vehicles table, occupants table and charges table
                        //var report2Remove = db.AccidentReports.SingleOrDefault(x => x.CaseId == accidentCaseId);
                        //if (report2Remove != null)
                        //{
                        //    db.AccidentReports.Remove(report2Remove);
                        //    db.SaveChanges();
                        //}

                        db.MVAR_Charges.RemoveRange(db.MVAR_Charges.Where(x => x.CaseId == accidentCaseId));
                        db.SaveChanges();

                        db.MVAR_Vehicles.RemoveRange(db.MVAR_Vehicles.Where(x => x.CaseId == accidentCaseId));
                        db.SaveChanges();

                        db.MVAR_Occupants.RemoveRange(db.MVAR_Occupants.Where(x => x.CaseId == accidentCaseId));
                        db.SaveChanges();

                        db.MVAR_Witnesses.RemoveRange(db.MVAR_Witnesses.Where(x => x.CaseId == accidentCaseId));
                        db.SaveChanges();

                        // insert a report accident                 
                        MVAR_AccidentReport report = formData.accidentReport;
                        accidentCaseId = (Int32)db.MVARReportCase_InsertUpdate(0, accidentCaseId, report.CaseNumber, report.CaseOwner, report.CaseStatus, report.CreateDate, report.LastEditDate,
                            report.CSR_Number, report.DriverSig, report.SupervisorSig, report.SafetyOfficerSig,
                            report.DriverSign_Time, report.SupervisorSig_Time, report.SafetyOfficerSig_Time, report.SupervisorScene_Response, report.SafetyOfficerScene_Reponse,
                            report.PhotoTaken, report.Seatbelt_InUse, report.PCD_Driver_Perm, report.PCD_InUse, report.Control1Call_Time, report.AccidentTime, report.PoliceReport_Number, report.AccidentLocation, report.WeatherCondition,
                            report.VehiclesInvolved_Number, report.Police_Investigation, report.Pedestrian_Involved, report.AccidentDesc, report.IntsSketch).FirstOrDefault();
                        
                       
                        // insert charges data 
                        List<MVAR_Charges> charges = formData.charges;
                        if (charges != null && charges.Count > 0)
                        {
                            //var ChargesRes = db.Charges.AddRange(charges.AsEnumerable());
                            foreach (MVAR_Charges charge in charges)
                            {
                                var res = db.MVARCharges_InsertUpdate(1, charge.CHARGEId, accidentCaseId, charge.CityEmpl_Charge, charge.ChargeAmount, charge.Summons_No, charge.Trial_Time).FirstOrDefault();
                            }
                        }

                        //insert Occupants data
                        List<MVAR_Occupants> Occupants = formData.occupants;
                        if (Occupants != null && Occupants.Count > 0)
                        {
                            //var OccupantsRes = db.Occupants.AddRange(Occupants.AsEnumerable());
                            foreach (MVAR_Occupants occupant in Occupants)
                            {
                                var res = db.MVAROccupants_InsertUpdate(1, occupant.OccupantId, accidentCaseId, occupant.Occupant_FirstName,occupant.Occupant_MiddleName, occupant.Occupant_LastName,
                                    occupant.OccupantAddress, occupant.Occupant_ExtentInjury, occupant.Occupant_DriverPassenger, occupant.Vehicle_Number, occupant.Occupant_PedestrianVehicle,
                                    occupant.Occupant_Injuerynature, occupant.Occupant_RemovedBy, occupant.Age, occupant.Sex).FirstOrDefault();
                            }
                        }
                        // insert vehicles data 
                        List<MVAR_Vehicles> Vehicles = formData.vehicles;
                        if (Vehicles != null && Vehicles.Count > 0)
                        {
                            //var VehiclesRes = db.Vehicles.AddRange(Vehicles.AsEnumerable());
                            foreach (MVAR_Vehicles vehicle in Vehicles)
                            {
                                var res = db.MVARVehicles_InsertUpdate(1, vehicle.VehicleId, accidentCaseId, vehicle.CityDriver, vehicle.DriverLicense_Number, vehicle.CityPermitNo, 
                                    vehicle.Driver_FirstName, vehicle.Driver_MiddleName, vehicle.Driver_lastName,  vehicle.Driver_Sex, vehicle.Driver_DOB, 
                                    vehicle.Driver_Homephone, vehicle.Driver_CDL, vehicle.Driver_POST, vehicle.Driver_Address, vehicle.Driver_City, vehicle.Driver_State, vehicle.Driver_County,
                                    vehicle.Driver_Zipcode, vehicle.Driver_Agency, vehicle.Driver_Bureau, vehicle.Driver_BusinessPhone,
                                    vehicle.Vehicle_pointImpact, vehicle.Vehicle_ExtDamage, vehicle.Fleet_ShopNumber, vehicle.Vehicle_Yearmake, vehicle.Vehicle_SerialNumber, vehicle.VehicleTag, vehicle.VehicleYear, vehicle.VehicleState, vehicle.OtherSpecify, vehicle.Owner_Name, vehicle.Owner_Address, vehicle.Owner_Phone, vehicle.Owner_InsuranceCom, vehicle.Owner_PolicyNo, vehicle.Driver_ExpDate, vehicle.Driver_VehicleState).FirstOrDefault(); ;
                            }
                        }

                        //insert witnesses
                        List<MVAR_Witnesses> Witnesses = formData.witnesses;
                        if (Witnesses != null && Witnesses.Count > 0)
                        {
                            //var WitnessesRes = db.Witnesses.AddRange(Witnesses.AsEnumerable());
                            foreach (MVAR_Witnesses witness in Witnesses)
                            {
                                var res = db.MVARWitnesses_InsertUpdate(1, witness.WitnessId, accidentCaseId, witness.WitnessName, witness.WitnessPhone, witness.WitnessAddress).FirstOrDefault(); ;
                            }
                        }

                        // add/update record for charges table                      
                        db.SaveChanges();
                        dbContextTransaction.Commit();
                      
                    }
                    catch (Exception ex)
                    {
                        Error = ex.Message;
                        dpwLogger.Error(Error);
                        dbContextTransaction.Rollback(); //Required according to MSDN article 
                        throw ex;
                    }
                }
            }

            return accidentCaseId;
        }

        #endregion 

        #region Delete Accident Report 

        public int closeAccidentReport(int caseId)
        {
            int accidentCaseId = -1;
            dpwLogger.Info("call Service closeAccidentReport");

            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {          
                try
                {                 
                    // delete records in accident report table, witness table, vehicles table, occupants table and charges table
                    var report2Remove = db.FieldReportCase_Delete(caseId);
                    db.SaveChanges();
                    accidentCaseId = caseId;
                    return accidentCaseId;

                }
                catch (Exception ex)
                {
                    Error = ex.Message;
                    dpwLogger.Error(Error);
                    throw ex;
                }
            }
        }
        #endregion 

    
        public List<string> getReportOwnerDDL()
        {
            List<string> ret = new List<string>();
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {
                // get report case data 
                ret = db.MVAR_AccidentReport
                              .Where(s => (s.CaseStatus == 2 && !(s.CaseOwner == null || s.CaseOwner.Trim() == string.Empty || s.CaseOwner == "")))
                              .Select(s => s.CaseOwner).Distinct().ToList();
            }
            ret.Add("N/A");
            return ret;
        }

        public List<string> getCaseNumberDDL()
        {
            List<string> ret = new List<string>();
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {
                // get report case data 
                ret = db.MVAR_AccidentReport
                             .Where(s => (s.CaseStatus == 2 && !(s.CaseOwner == null || s.CaseOwner.Trim() == string.Empty || s.CaseNumber == "")))
                             .Select(s => s.CaseNumber).Distinct().ToList();
            }
            ret.Add("N/A");
            return ret;
        }

        public List<string> getAccidentDatesDDL()
        {
            List<string> ret = new List<string>();
            List<DateTime?> temp = new List<DateTime?>();
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {
                // get report case data 
                temp = db.MVAR_AccidentReport
                             .Where(s => (s.CaseStatus == 2 && !(s.AccidentTime == null)))
                             .Select(s => s.AccidentTime).Distinct().ToList();
            }

            for (int i = 0; i < temp.Count; i++)
            {
                var item = temp[i];
                if (item != null)
                {
                    var dtStr = item.Value.Date.ToString();
                    ret.Add(dtStr);
                }
            }
            ret.Add("N/A");
            return ret;
        }

        public List<MVAR_AccidentReport> getClosedReportsByParas(string officer, string accidentDate, string caseNumber)
        {
            DateTime accidentDT = new DateTime();
            if (officer == "N/A")
            {
                officer = null;
            }
            if (accidentDate == "N/A")
            {
                accidentDT = new DateTime(1981, 03, 01).Date;
            }
            else
            {
                accidentDT = Convert.ToDateTime(accidentDate).Date;
            }

            if (caseNumber == "N/A")
            {
                caseNumber = null;
            }

            List<MVAR_AccidentReport> accidents = new List<MVAR_AccidentReport>();
            using (DPW_MVAREntities db = new DPW_MVAREntities())
            {
                // get all active report cases 
                accidents = db.MVAR_AccidentReport
                    .Where(s => s.CaseStatus == 2)
                    .Where(s => ( s.CaseNumber == caseNumber || s.CaseOwner == officer || (s.AccidentTime.Value.Year == accidentDT.Year
                            && s.AccidentTime.Value.Month == accidentDT.Month
                            && s.AccidentTime.Value.Day == accidentDT.Day) ) )            
                    .ToList();
            }
            return accidents;

        }
    }
}
