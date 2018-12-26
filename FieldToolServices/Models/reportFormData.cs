using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FieldToolServices.Models
{
    public class reportFormData
    {
        public MVAR_AccidentReport accidentReport { get; set; }
        public List<MVAR_Vehicles> vehicles { get; set; }
        public List<MVAR_Occupants> occupants { get; set; }
        public List<MVAR_Witnesses> witnesses { get; set; }
        public List<MVAR_Charges> charges { get; set; }
    }
}