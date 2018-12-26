﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FieldToolData.Models
{
    public class reportFormData
    {
        public AccidentReport accidentReport { get; set; }
        public List<Vehicle> vehicles { get; set; }
        public List<Occupant> occupants { get; set; }
        public List<Witness> witnesses { get; set; }
        public List<Charge> charges { get; set; }
    }
}
