//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace FieldToolServices
{
    using System;
    using System.Collections.Generic;
    
    public partial class MVAR_AccidentReport
    {
        public int CaseId { get; set; }
        public string CaseNumber { get; set; }
        public string CaseOwner { get; set; }
        public int CaseStatus { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public Nullable<System.DateTime> LastEditDate { get; set; }
        public string CSR_Number { get; set; }
        public byte[] DriverSig { get; set; }
        public byte[] SupervisorSig { get; set; }
        public byte[] SafetyOfficerSig { get; set; }
        public Nullable<System.DateTime> DriverSign_Time { get; set; }
        public Nullable<System.DateTime> SupervisorSig_Time { get; set; }
        public Nullable<System.DateTime> SafetyOfficerSig_Time { get; set; }
        public Nullable<int> SupervisorScene_Response { get; set; }
        public Nullable<int> SafetyOfficerScene_Reponse { get; set; }
        public Nullable<int> PhotoTaken { get; set; }
        public Nullable<int> PCD_Driver_Perm { get; set; }
        public Nullable<int> PCD_InUse { get; set; }
        public Nullable<System.DateTime> Control1Call_Time { get; set; }
        public string PoliceReport_Number { get; set; }
        public string AccidentLocation { get; set; }
        public string WeatherCondition { get; set; }
        public Nullable<int> VehiclesInvolved_Number { get; set; }
        public Nullable<int> Police_Investigation { get; set; }
        public Nullable<int> Pedestrian_Involved { get; set; }
        public string AccidentDesc { get; set; }
        public byte[] IntsSketch { get; set; }
        public Nullable<int> Seatbelt_InUse { get; set; }
        public Nullable<System.DateTime> AccidentTime { get; set; }
    }
}
