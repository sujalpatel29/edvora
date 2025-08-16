import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import EssayAssistant from "@/components/EssayAssistant";
import StudyPlanner from "@/components/StudyPlanner";
import LearningHub from "@/components/LearningHub";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "essay":
        return <EssayAssistant />;
      case "schedule":
        return <StudyPlanner />;
      case "topics":
        return <LearningHub />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
