using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FieldTool.Models
{
    public class AccidentReportPost
    {
        public int CaseId { get; set; }
        public string CaseNumber { get; set; }
        public string CaseOwner { get; set; }
        public int CaseStatus { get; set; }
        public string CreateDate { get; set; }
        public string LastEditDate { get; set; }
        public string CSR_Number { get; set; }
        public object DriverSig { get; set; }
        public object SupervisorSig { get; set; }
        public object SafetyOfficerSig { get; set; }
        public string DriverSign_Time { get; set; }
        public string SupervisorSig_Time { get; set; }
        public string SafetyOfficerSig_Time { get; set; }
        public Nullable<int> SupervisorScene_Response { get; set; }
        public Nullable<int> SafetyOfficerScene_Reponse { get; set; }
        public Nullable<int> PhotoTaken { get; set; }
        public Nullable<int> PCD_Driver_Perm { get; set; }
        public Nullable<int> PCD_InUse { get; set; }
        public string Control1Call_Time { get; set; }
        public string PoliceReport_Number { get; set; }
        public string AccidentLocation { get; set; }
        public string WeatherCondition { get; set; }
        public Nullable<int> VehiclesInvolved_Number { get; set; }
        public Nullable<int> Police_Investigation { get; set; }
        public Nullable<int> Pedestrian_Involved { get; set; }
        public string AccidentDesc { get; set; }
        public object IntsSketch { get; set; }
        public Nullable<int> Seatbelt_InUse { get; set; }
        public string AccidentTime { get; set; }
    }
}
