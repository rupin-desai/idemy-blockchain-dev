import React, { useState } from "react";
import Card from "../ui/Card";

// Common components
import AlertNotification from "../components/FeaturesTest/AlertNotification";
import TabNavigation from "../components/FeaturesTest/TabNavigation";

// Forms Tab
import TestFormControls from "../components/FeaturesTest/TestFormControls";

// Tables Tab
import TestIdentitiesTable from "../components/FeaturesTest/TestIdentitiesTable";
import TestTablePagination from "../components/FeaturesTest/TestTablePagination";

// Identities Tab
import TestCreateIdentity from "../components/FeaturesTest/TestCreateIdentity";
import TestVerifyIdentity from "../components/FeaturesTest/TestVerifyIdentity";

// Blockchain Tab
import TestBlockchainStatus from "../components/FeaturesTest/TestBlockchainStatus";
import TestContractInteractions from "../components/FeaturesTest/TestContractInteractions";
import TestTransaction from "../components/FeaturesTest/TestTransaction";

const TestFeatures = () => {
  const [activeTab, setActiveTab] = useState("forms");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");

  const handleSubmitSuccess = () => {
    setAlertType("success");
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleError = () => {
    setAlertType("error");
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Features</h1>
        <p className="text-gray-600 mt-1">
          Test all components and features in one place
        </p>
      </div>

      <AlertNotification
        show={showAlert}
        type={alertType}
        onClose={() => setShowAlert(false)}
      />

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={["forms", "tables", "identities", "blockchain"]}
      />

      {activeTab === "forms" && (
        <TestFormControls
          onSubmitSuccess={handleSubmitSuccess}
          onError={handleError}
        />
      )}

      {activeTab === "tables" && (
        <Card title="Data Tables">
          <TestIdentitiesTable />
          <TestTablePagination
            currentPage={1}
            totalPages={1}
            totalItems={4}
            itemsPerPage={10}
          />
        </Card>
      )}

      {activeTab === "identities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestCreateIdentity />
          <TestVerifyIdentity />
        </div>
      )}

      {activeTab === "blockchain" && (
        <Card title="Blockchain Operations">
          <div className="space-y-6">
            <TestBlockchainStatus />
            <TestContractInteractions />
            <TestTransaction />
          </div>
        </Card>
      )}
    </div>
  );
};

export default TestFeatures;
