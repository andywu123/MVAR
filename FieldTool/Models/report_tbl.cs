using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FieldTool.Models
{
    public class report_tbl
    {
        public int CaseId { get; set; }
        public string CaseNumber { get; set; }
        public string AccidentLocation { get; set; }
        public string AccidentTime { get; set; }
        public string CreateDate { get; set; }
    }
}