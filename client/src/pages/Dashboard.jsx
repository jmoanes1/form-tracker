import { useCallback, useEffect, useState } from "react";

import BarChart from "../components/BarChart";
import BulkActions from "../components/BulkActions";
import ConfirmModal from "../components/ConfirmModal";
import DonutChart from "../components/DonutChart";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";
import ImportModal from "../components/ImportModal";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import Toast from "../components/Toast";
import WebsiteDetailModal from "../components/WebsiteDetailModal";
import WebsiteForm from "../components/WebsiteForm";
import WebsiteTable from "../components/WebsiteTable";
import WebsiteTestModal from "../components/WebsiteTestModal";

import {
  createWebsite,
  deleteWebsite,
  getWebsites,
  updateWebsite,
} from "../services/api";

import {
  PAGE_SIZE,
  STATUS_OPTIONS,
  calculateStats,
  filterWebsites,
  paginate,
  sortWebsites,
} from "../utils/websiteList";
import { createWebsitesCsv } from "../utils/csv";

function Dashboard() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Empty string means "no operation is running". It disables the buttons so
  // the same request cannot be started twice by accident.
  const [busy, setBusy] = useState("");

  // Search, filtering, sorting and pagination
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [formModal, setFormModal] = useState(null);
  const [testWebsite, setTestWebsite] = useState(null);
  const [detailWebsite, setDetailWebsite] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [modalError, setModalError] = useState("");

  // Notification
  const [toast, setToast] = useState(null);

  // ----- values calculated from the website array -----

  const stats = calculateStats(websites);

  const filteredWebsites = filterWebsites(websites, {
    search,
    type: typeFilter,
    status: statusFilter,
  });

  const sortedWebsites = sortWebsites(filteredWebsites, sortBy);

  const pagination = paginate(sortedWebsites, page, PAGE_SIZE);
  const pageWebsites = pagination.items;

  const hasFilters = Boolean(search || typeFilter || statusFilter);

  const pageIds = pageWebsites.map((website) => website.id);

  const allPageSelected =
    pageIds.length > 0 &&
    pageIds.every((id) => selectedIds.includes(id));

  const statusChartItems = [
    { key: "working", label: "Working", value: stats.working },
    { key: "not-working", label: "Not Working", value: stats.notWorking },
    { key: "broken", label: "Broken", value: stats.broken },
    { key: "untested", label: "Untested", value: stats.untested },
  ];

  const statusLabel = (value) => {
    const option = STATUS_OPTIONS.find((item) => item.value === value);

    return option ? option.label : value;
  };

  // ----- data loading -----

  async function loadWebsites() {
    setLoading(true);

    try {
      const result = await getWebsites();

      setWebsites(result.data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    getWebsites()
      .then((result) => {
        if (isActive) {
          setWebsites(result.data);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    // Ignore the answer when the page is closed before it arrives.
    return () => {
      isActive = false;
    };
  }, []);

  // ----- notifications -----

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function exportWebsites() {
    const csv = createWebsitesCsv(websites);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "form-testing-websites.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast(`${websites.length} websites exported.`);
  }

  // ----- add / edit -----

  function openAddForm() {
    setModalError("");
    setFormModal({ mode: "add" });
  }

  function openEditForm(website) {
    setModalError("");
    setDetailWebsite(null);
    setFormModal({ mode: "edit", website });
  }

  function closeFormModal() {
    if (busy === "saving") {
      return;
    }

    setFormModal(null);
    setModalError("");
  }

  async function handleSubmitForm(values) {
    const isEdit = Boolean(formModal) && formModal.mode === "edit";

    try {
      setBusy("saving");
      setModalError("");

      const result = isEdit
        ? await updateWebsite(formModal.website.id, values)
        : await createWebsite(values);

      setFormModal(null);
      setSelectedIds([]);
      showToast(
        result.message ||
          (isEdit
            ? "Website updated successfully."
            : "Website added successfully.")
      );

      await loadWebsites();
    } catch (requestError) {
      // Keep the modal open so the typed values are not lost.
      setModalError(requestError.message);
    } finally {
      setBusy("");
    }
  }

  // ----- form testing -----

  function openTestModal(website) {
    setModalError("");
    setDetailWebsite(null);
    setTestWebsite(website);
  }

  function closeTestModal() {
    if (busy === "testing") {
      return;
    }

    setTestWebsite(null);
    setModalError("");
  }

  async function handleSaveTestResult(values) {
    try {
      setBusy("testing");
      setModalError("");

      await updateWebsite(testWebsite.id, values);

      setTestWebsite(null);
      setSelectedIds([]);
      showToast("Test result saved");

      await loadWebsites();
    } catch (requestError) {
      setModalError(requestError.message);
    } finally {
      setBusy("");
    }
  }

  // ----- delete -----

  function requestDeleteWebsite(website) {
    setDetailWebsite(null);
    setConfirmDelete({ type: "single", website });
  }

  function requestDeleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    setConfirmDelete({ type: "bulk", count: selectedIds.length });
  }

  async function handleConfirmDelete() {
    const isBulk = confirmDelete.type === "bulk";
    const ids = isBulk ? selectedIds : [confirmDelete.website.id];

    try {
      setBusy("deleting");

      for (const id of ids) {
        await deleteWebsite(id);
      }

      setConfirmDelete(null);
      setSelectedIds([]);
      showToast(
        isBulk
          ? `${ids.length} websites deleted successfully.`
          : "Website deleted successfully."
      );

      await loadWebsites();
    } catch (requestError) {
      setConfirmDelete(null);
      showToast(requestError.message, "error");
    } finally {
      setBusy("");
    }
  }

  // ----- bulk actions -----

  async function handleMarkStatus(status) {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setBusy("bulk");

      // "untested" means it has not been tested, so there is no date.
      const lastTested =
        status === "untested" ? null : new Date().toISOString();

      for (const id of selectedIds) {
        await updateWebsite(id, { status, lastTested });
      }

      const count = selectedIds.length;

      setSelectedIds([]);
      showToast(`${count} websites marked as ${statusLabel(status)}.`);

      await loadWebsites();
    } catch (requestError) {
      showToast(requestError.message, "error");
    } finally {
      setBusy("");
    }
  }

  function toggleSelect(id) {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id]
    );
  }

  function toggleSelectAllOnPage() {
    setSelectedIds((currentIds) => {
      const selectedOnPage = pageIds.every((id) => currentIds.includes(id));

      if (selectedOnPage) {
        return currentIds.filter((id) => !pageIds.includes(id));
      }

      return Array.from(new Set([...currentIds, ...pageIds]));
    });
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  // ----- search, filters and pagination -----
  // Every filter resets the page, so the user never lands on an empty page.

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function handleTypeChange(value) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleStatusChange(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleSortChange(value) {
    setSortBy(value);
    setPage(1);
  }

  // ----- CSV import -----

  async function handleImportFinished(summary) {
    setSelectedIds([]);

    await loadWebsites();

    showToast(
      `Import finished: ${summary.imported} imported, ` +
        `${summary.duplicates} duplicates, ${summary.invalidUrls} invalid URLs.`,
      summary.imported > 0 ? "success" : "error"
    );
  }

  return (
    <div className="dashboard">
      <Header
        onAddWebsite={openAddForm}
        onExportWebsites={exportWebsites}
      />

      {error && (
        <div className="error-message">{error}</div>
      )}

      <section className="stats-grid">
        <StatCard title="Total Websites" count={stats.total} type="total" />
        <StatCard title="Working" count={stats.working} type="working" />
        <StatCard
          title="Not Working"
          count={stats.notWorking}
          type="not-working"
        />
        <StatCard title="Broken" count={stats.broken} type="broken" />
        <StatCard title="Untested" count={stats.untested} type="untested" />
        <StatCard title="Leads Websites" count={stats.leads} type="leads" />
        <StatCard
          title="None Leads"
          count={stats.noneLeads}
          type="none-leads"
        />
      </section>

      <section className="charts-grid">
        <div className="chart-card">
          <h3>Form Testing Status</h3>
          <BarChart items={statusChartItems} />
        </div>

        <div className="chart-card">
          <h3>Status overview</h3>
          <DonutChart items={statusChartItems} total={stats.total} />
        </div>
      </section>

      <section className="websites-section">
        <div className="section-header">
          <div>
            <h2>Websites</h2>
            <p>
              Manage and test your websites.
            </p>
          </div>

          <div className="section-controls">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              disabled={loading}
            />

            <FilterBar
              type={typeFilter}
              status={statusFilter}
              sortBy={sortBy}
              onTypeChange={handleTypeChange}
              onStatusChange={handleStatusChange}
              onSortChange={handleSortChange}
              disabled={loading}
            />
          </div>
        </div>

        <BulkActions
          selectedCount={selectedIds.length}
          busy={Boolean(busy)}
          onMarkStatus={handleMarkStatus}
          onDeleteSelected={requestDeleteSelected}
          onClearSelection={clearSelection}
        />

        {loading ? (
          <div className="loading">
            Loading websites...
          </div>
        ) : (
          <>
            <WebsiteTable
              websites={pageWebsites}
              selectedIds={selectedIds}
              busy={Boolean(busy)}
              allSelected={allPageSelected}
              emptyTitle={
                hasFilters
                  ? "No websites match your filters"
                  : "No websites found"
              }
              emptyMessage={
                hasFilters
                  ? "Try another search, type or status."
                  : "Add your first website to start testing."
              }
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAllOnPage}
              onTest={openTestModal}
              onView={setDetailWebsite}
              onEdit={openEditForm}
              onDelete={requestDeleteWebsite}
            />

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              start={pagination.start}
              end={pagination.end}
              total={pagination.total}
              onPageChange={setPage}
              disabled={Boolean(busy)}
            />
          </>
        )}
      </section>

      {formModal && (
        <Modal
          title={
            formModal.mode === "edit" ? "Edit Website" : "Add Website"
          }
          onClose={closeFormModal}
          closeDisabled={busy === "saving"}
        >
          <WebsiteForm
            initialValues={formModal.website}
            showStatus={formModal.mode === "edit"}
            submitLabel={
              formModal.mode === "edit" ? "Save Changes" : "Add Website"
            }
            submitting={busy === "saving"}
            error={modalError}
            onSubmit={handleSubmitForm}
            onCancel={closeFormModal}
          />
        </Modal>
      )}

      {testWebsite && (
        <WebsiteTestModal
          website={testWebsite}
          saving={busy === "testing"}
          error={modalError}
          onSave={handleSaveTestResult}
          onCancel={closeTestModal}
        />
      )}

      {detailWebsite && (
        <WebsiteDetailModal
          website={detailWebsite}
          onClose={() => setDetailWebsite(null)}
          onTest={openTestModal}
          onEdit={openEditForm}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Website?"
          message={
            confirmDelete.type === "bulk"
              ? `Are you sure you want to delete ${confirmDelete.count} selected websites?`
              : "Are you sure you want to delete:"
          }
          details={
            confirmDelete.type === "bulk"
              ? ""
              : confirmDelete.website.website
          }
          busyLabel="Deleting..."
          busy={busy === "deleting"}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {importOpen && (
        <ImportModal
          existingWebsites={websites}
          onClose={() => setImportOpen(false)}
          onFinished={handleImportFinished}
        />
      )}

      <Toast
        message={toast?.message}
        type={toast?.type}
        onDismiss={hideToast}
      />
    </div>
  );
}

export default Dashboard;
