using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using FieldTool.Adapters;
using FieldToolServices;
using DPWLogSystem;
using FieldTool.Models;
using FieldToolServices.Models;
using System.Configuration;
using System.Threading.Tasks;
using System.Net;
using System.Security.Principal;

namespace FieldTool.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        private DPWLogger dpwLogger;
        public ActionResult Index()
        {
            FormDataAccess ds = new FormDataAccess();
            ViewBag.AccidentsList = ds.getReportForms();
            return View();
        }


        public ActionResult inkSign()
        {
            return View("inkSign");
        }



        public ActionResult canvasIntersection()
        {
            return View("IntersectionCanvas");
        }

        public ActionResult WordFormParse()
        {
            return View("WordFormParse");
        }

        public ActionResult CreateAccidentReport()
        {
            return View("AccidentForm");
        }


        public ActionResult logoutUser()
        {
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("Index");
        }


        public Boolean CloseAccidentReport(int caseId)
        {           
            try
            {
                if (dpwLogger == null)
                {
                    dpwLogger = new DPWLogger(this.GetType().Name);
                }
                FormDataAccess ds = new FormDataAccess();
                int accidentId = ds.closeAccidentReport(caseId);

                bool QueryRes = accidentId > 0 ? true : false;

                return QueryRes;
            }
            catch (Exception ex)
            {
                dpwLogger.Error("Close Accident Report Error" + ex.Message);
                throw new Exception("error" + ex);
            }
        }

        public ActionResult EditAccidentReport(int CaseId)
        {
             FormDataAccess ds = new FormDataAccess();
             reportFormData accessData = ds.getReportFormbyCaseId(CaseId);
             ViewBag.AccidentReportForm = Form2Report.setFormDatafromService(accessData);
             return View("AccidentEditForm");
        }    
 
        public ActionResult ViewAccidentReport(int CaseId)
        {
             FormDataAccess ds = new FormDataAccess();
             reportFormData accessData = ds.getReportFormbyCaseId(CaseId);
             ViewBag.AccidentReportForm = Form2Report.setFormDatafromService(accessData);
             return View("AccidentViewForm");
        }

        [HttpGet]
        public virtual ActionResult DownloadFile(string fileguid, string filename)
        {
            if (TempData[fileguid] != null)
            {
                byte[] data = TempData[fileguid] as byte[];
                return File(data, "application/pdf", filename);
            }
            else
            {
                return new EmptyResult();
            }
        }

        public async Task<ActionResult> PrintAccidentReport(int CaseId)
        {
            DPWLogger.Config();
            DPWLogger.SetLogingLevel(ConfigurationManager.AppSettings["LoggerLevel"]);

            dpwLogger = new DPWLogger("MyLog");

            string userName = Convert.ToString(ConfigurationManager.AppSettings["ReportServerUsername"]);
            string password = Convert.ToString(ConfigurationManager.AppSettings["ReportServerPassword"]);
            string reportServerURL = Convert.ToString(ConfigurationManager.AppSettings["ReportServerName"]);
            string reportDomain = Convert.ToString(ConfigurationManager.AppSettings["ReportServerDomain"]);
            string reportFolder = ConfigurationManager.AppSettings["ReportServerReportFolder"];
            string reportName = ConfigurationManager.AppSettings["AccidentReport"];
            string format = "PDF";

            FormDataAccess ds = new FormDataAccess();
            MVAR_AccidentReport reportobj = ds.getReportByCaseId(CaseId);
            string url = @reportServerURL +
                                                                        "/Pages/ReportViewer.aspx?" + "%2f" + reportFolder +
                                                                        "%2f" + reportName +
                                                                        "&rs:Command=Render&rs:format=" + format +
                                                                        "&ReportId=" + CaseId;

            Uri myUri = new Uri(url);
            HttpWebRequest webReq = (HttpWebRequest)WebRequest.Create(url);

        // http://dpw-cisrep-tst/ReportServer/Pages/ReportViewer.aspx?%2fDPW_MVAR%2fFieldFormReport&rs:Command=Render

            //webReq.UseDefaultCredentials = true;
            //webReq.PreAuthenticate = true;
            //webReq.Credentials = CredentialCache.DefaultCredentials;
            //NetworkCredential myNetworkCredential = new System.Net.NetworkCredential(userName, password, reportDomain);
            //myNetworkCredential.Domain = reportDomain;
            //CredentialCache myCredentialCache = new CredentialCache();
            //myCredentialCache.Add(myUri, "Basic", myNetworkCredential);

    
            webReq.Method = "GET";
            webReq.PreAuthenticate = true;
            webReq.Credentials = CredentialCache.DefaultNetworkCredentials;
            WindowsIdentity identity = System.Web.HttpContext.Current.Request.LogonUserIdentity;
            string name = identity.Name;
            //dpwLogger.Info("network credential:  " + myNetworkCredential.UserName);
            dpwLogger.Info("user name:  " + name);
            try
            {
                HttpWebResponse webResp = (HttpWebResponse)webReq.GetResponse();
                Stream report = webResp.GetResponseStream();
                MemoryStream stream = new MemoryStream();
                report.CopyTo(stream);

                string handle = Guid.NewGuid().ToString();
                string fileName = reportName +  ".pdf";
                TempData[handle] = stream.ToArray();

                return Json(new { FileGuid = handle, FileName = fileName }, JsonRequestBehavior.AllowGet);
            }
            catch (WebException ex)
            {
                string filepath = @"C:\ErrorLogging\Error_" + DateTime.Now.ToShortDateString().Replace("/", "").Trim() + ".txt";
                using (StreamWriter writer = new StreamWriter(filepath, true))
                {
                    writer.WriteLine("Message :" + ex.Message + "<br/>" + Environment.NewLine + "StackTrace :" + ex.StackTrace +
                    "" + Environment.NewLine + "Date :" + DateTime.Now.ToString());
                    writer.WriteLine("Credentials: " + webReq.Credentials);
                    writer.WriteLine(Environment.NewLine + "-----------------------------------------------------------------------------" + Environment.NewLine);

                }
                return null;
            }
        }

    }
}
