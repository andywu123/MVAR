using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FieldToolData.Models
{
    public class VehicleData
    {
        public int VehicleId { get; set; }
        public decimal CaseId { get; set; }
        public Nullable<int> CityDriver { get; set; }
        public string CityPermitNo { get; set; }
        public string DriverName { get; set; }
        public string VehicleTag { get; set; }
        public string DriverAddress { get; set; }
    }
}
