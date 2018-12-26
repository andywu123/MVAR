using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FieldTool.Models
{
    public class VehiclePost
    {
        public int VehicleId { get; set; }
        public int CaseId { get; set; }
        public Nullable<int> CityDriver { get; set; }
        public string DriverLicense_Number { get; set; }
        public string CityPermitNo { get; set; }
        public string Driver_FirstName { get; set; }
        public string Driver_MiddleName { get; set; }
        public string Driver_lastName { get; set; }
        public string Driver_Sex { get; set; }
        public string Driver_DOB { get; set; }
        public Nullable<int> Driver_Homephone { get; set; }
        public Nullable<int> Driver_CDL { get; set; }
        public Nullable<int> Driver_POST { get; set; }
        public string Driver_Address { get; set; }
        public string Driver_City { get; set; }
        public string Driver_State { get; set; }
        public string Driver_County { get; set; }
        public Nullable<int> Driver_Zipcode { get; set; }
        public string Driver_Agency { get; set; }
        public string Driver_Bureau { get; set; }
        public string Driver_BusinessPhone { get; set; }
        public string Vehicle_pointImpact { get; set; }
        public string Vehicle_ExtDamage { get; set; }
        public string Fleet_ShopNumber { get; set; }
        public string Vehicle_Yearmake { get; set; }
        public string Vehicle_SerialNumber { get; set; }
        public string VehicleTag { get; set; }
        public string VehicleYear { get; set; }
        public string VehicleState { get; set; }
        public string OtherSpecify { get; set; }
        public string Owner_Name { get; set; }
        public string Owner_Address { get; set; }
        public Nullable<int> Owner_Phone { get; set; }
        public string Owner_InsuranceCom { get; set; }
        public string Owner_PolicyNo { get; set; }
        public string Driver_ExpDate { get; set; }
        public string Driver_VehicleState { get; set; }
    }
}
