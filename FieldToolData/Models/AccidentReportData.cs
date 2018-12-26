using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FieldToolData.Models
{
    public class AccidentReportData
    {
        public int CaseId { get; set; }
        public string DriverSig_URL { get; set; }
        public string SupervisorSig_URL { get; set; }
        public Nullable<System.DateTime> DriverSign_Time { get; set; }
        public Nullable<int> SupervisorScene_Response { get; set; }
        public Nullable<int> SafetyOfficerScene_Reponse { get; set; }
        public string SafetyOfficerSig_URL { get; set; }
        public Nullable<int> PhotoTaken { get; set; }
        public string WeatherCondition { get; set; }
        public string AccidentDesc { get; set; }
        public string Photo_Storedpath { get; set; }
        public string IntsSketch_StoredPath { get; set; }
    }
}
