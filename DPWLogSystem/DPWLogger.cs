using log4net;
using log4net.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPWLogSystem
{
    public class DPWLogger
    {
        ILog logger;
        public long memSize;
        public DPWLogger(string name)
        {
            logger = LogManager.GetLogger(name);
        }
        public static void Config()
        {
            XmlConfigurator.Configure();
        }
        public static void SetLogingLevel(string str)
        {
            string strChecker = "WARN_INFO_DEBUG_ERROR_FATAL";

            if (String.IsNullOrEmpty(str) == true)
                throw new Exception(" The level can not be null");

            str = str.ToUpper();
            if(strChecker.Contains(str) == false)
                throw new Exception(" The level should be set to WARN , INFO , DEBUG , ERROR, FATAL (case insensitive)");

            log4net.Repository.ILoggerRepository[] repositories = log4net.LogManager.GetAllRepositories();

            //Configure all loggers to be at the debug level.
            foreach (log4net.Repository.ILoggerRepository repository in repositories)
            {
                repository.Threshold = repository.LevelMap[str];
                log4net.Repository.Hierarchy.Hierarchy hier = (log4net.Repository.Hierarchy.Hierarchy)repository;
                log4net.Core.ILogger[] loggers = hier.GetCurrentLoggers();
                foreach (log4net.Core.ILogger logger in loggers)
                {
                    ((log4net.Repository.Hierarchy.Logger)logger).Level = hier.LevelMap[str];
                }
            }

            //Configure the root logger.
            log4net.Repository.Hierarchy.Hierarchy h = (log4net.Repository.Hierarchy.Hierarchy)log4net.LogManager.GetRepository();
            log4net.Repository.Hierarchy.Logger rootLogger = h.Root;
            rootLogger.Level = h.LevelMap[str];
        }
        public void Debug(string msg)
        {
            logger.Debug(msg);
        }
        public void Info(string msg)
        {
            logger.Info(msg);
        }
        public void Warn(string msg)
        {
            logger.Warn(msg);
        }
        public void Error(string msg)
        {
            logger.Error(msg);
        }
        public void Fatal(string msg)
        {
            logger.Fatal(msg);
        }

        public void memoryMeasureStart()
        {
            memSize = System.GC.GetTotalMemory(true); // true: wait for GC collection
        }
        public void memoryMeasureEnd()
        {
            memSize = System.GC.GetTotalMemory(true) - memSize;
            logger.Info("memory size = " + memSize/1024 + " K");
        }
    }
}
