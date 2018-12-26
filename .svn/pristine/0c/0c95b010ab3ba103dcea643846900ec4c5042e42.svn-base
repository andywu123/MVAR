using FieldTool.Adapters;
using FieldToolServices;
using FieldToolServices.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using DPWLogSystem;
using System.Configuration;
using FieldTool.Models;

namespace FieldTool.Controllers
{
    public class ReportAccessController : ApiController
    {
        private DPWLogger dpwLogger;

        [HttpGet]
        public reportFormDataPost getReportFormbyCaseId(int caseId)
        {
            reportFormDataPost res = new reportFormDataPost();
            reportFormData frm = new reportFormData();
            FormDataAccess ds = new FormDataAccess();
            frm = ds.getReportFormbyCaseId(caseId);
            res = Form2Report.setFormDatafromService(frm);

            return res;
        }

        [HttpGet]
        public List<string> getReportOwnerDDL()
        {
            List<string> res = new List<string>();
            FormDataAccess ds = new FormDataAccess();
            res = ds.getReportOwnerDDL();

            return res;
        }

        [HttpGet]
        public List<string> getCaseNumberDDL()
        {
            List<string> res = new List<string>();
            FormDataAccess ds = new FormDataAccess();
            res = ds.getCaseNumberDDL();

            return res;
        }
        
        [HttpGet]
        public List<string> getAccidentDatesDDL()
        {
            List<string> res = new List<string>();
            FormDataAccess ds = new FormDataAccess();
            res = ds.getAccidentDatesDDL();

            return res;
        }

        [HttpGet]
        public List<report_tbl> getClosedReportsByParas(string officer, string accidentDate, string caseNumber)
        {
            List<report_tbl> res = new List<report_tbl>();
            List<MVAR_AccidentReport> res_reports = new List<MVAR_AccidentReport>();
            FormDataAccess ds = new FormDataAccess();
            res_reports = ds.getClosedReportsByParas(officer, accidentDate, caseNumber);
            for (int i = 0; i < res_reports.Count; i++)
            {
                var item = res_reports[i];
                report_tbl row = new report_tbl();
                row.CaseId = item.CaseId;
                row.CaseNumber = item.CaseNumber;
                row.AccidentLocation = item.AccidentLocation;

                if (item.CreateDate != null)
                {
                    var dt = (DateTime)item.CreateDate;
                    row.CreateDate = dt.ToString("yyyy-MM-dd HH:mm:ss");
                }

                if (item.AccidentTime != null)
                {
                    var dt = (DateTime)item.AccidentTime;
                    row.AccidentTime = dt.ToString("yyyy-MM-dd HH:mm:ss");
                }

                res.Add(row);
            }

            return res;
        }

        [HttpGet]
        public List<MVAR_AccidentReport> getReportForms()
        {

            List<MVAR_AccidentReport> accidents = new List<MVAR_AccidentReport>();
            FormDataAccess ds = new FormDataAccess();
            accidents = ds.getReportForms();
            DPWLogger.Config();
            DPWLogger.SetLogingLevel(ConfigurationManager.AppSettings["LoggerLevel"]);

            dpwLogger = new DPWLogger("MyLog");


            dpwLogger.Info("Get all report forms");
            return accidents;
        }

        [HttpPost]
        public int AddReportForm([FromBody]FormDataCollection form)
        {
            FormDataAccess ds = new FormDataAccess();
            reportFormData formData = new reportFormData();
            formData = Form2Report.convert2ReportData(form, 1);
            int invetigationId = ds.AddReportForm(formData);
            return invetigationId;
        }

        //[HttpPost]
        //public int UpdateReportForm([FromBody]FormDataCollection form)
        //{
        //    FormDataAccess ds = new FormDataAccess();
        //    reportFormData formData = new reportFormData();
        //    formData = Form2Report.convert2ReportData(form,2);
        //    int invetigationId = ds.UpdateReportForm(formData);
        //    return invetigationId;
        //}

        [HttpPost]
        public int UpdateReportForm([FromBody] reportFormDataPost report)
        {
            FormDataAccess ds = new FormDataAccess();
            reportFormData formData = new reportFormData();
            formData = Form2Report.convert2ReportData(report, 2);
            int invetigationId = ds.UpdateReportForm(formData);
            return invetigationId;

        }

        [HttpDelete]
        public int delAccidentReport(int caseId)
        {
            FormDataAccess ds = new FormDataAccess();
            int invetigationId = ds.closeAccidentReport(caseId);
            return invetigationId;
        }

    }
}
