import Button from "./components/ui/Buttons/Button";
import "./components/ui/brand-setting.css";
import Input from "./components/ui/Forms/Input/Input";
import Select from "./components/ui/Forms/Select/Select";
import Checkboxes from "./components/ui/Forms/Checkboxes/Checkboxes";
import Toggles from "./components/ui/Forms/Toggles/Toggles";
import Banner from "./components/ui/Feedback/Banner/Banner";
import Progress from "./components/ui/Feedback/Progress/Progress";
import Skeleton from "./components/ui/Feedback/Skeleton/Skeleton";
import Tooltip from "./components/ui/Feedback/Tooltip/Tooltip";
import Modal from "./components/ui/Feedback/Modal/Modal";
import Toast from "./components/ui/Feedback/Toast/Toast";
import Table from "./components/ui/Table/Table";
import { InfoIcon, CheckIcon, XIcon, AlertTriangleIcon } from "./components/ui/Icons/Icons";
import Breadcrumb from "./components/ui/Navigation/Breadcrumb/Breadcrumb";
import Dropdown from "./components/ui/Navigation/Dropdown/Dropdown";
import Navbar from "./components/ui/Navigation/Navbar/Navbar";
import { SidebarAdapter, Sidebar } from "./components/ui/Navigation/Sidebar/Sidebar";
import Tabs from "./components/ui/Navigation/Tabs/Tabs";
import { useState } from "react";
import AllIconsPage from "./pages/AllIconsPage";
import {
  DashboardIcon,
  OrganizationIcon,
  UsersIcon,
  ChartBarIcon,
  IntegrationIcon,
  CreditCardIcon,
  ShieldIcon,
  SettingsIcon,
  QuestionCircleIcon,
  LogoutIcon,
} from "./components/ui/Icons/Icons"
import Pagination, { usePagination } from "./components/ui/Navigation/Pagination/Pagination";

function App() {
  const [checked, setChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showAllIcons, setShowAllIcons] = useState(false);
  const [page, setPage] = useState(1);
  const totalPages = 20;
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [tablePage, setTablePage] = useState(1);

  const PAGE_SIZE = 5;

  const ALL_DATA = [
    { id: "WS-001", name: "Acme Corp", domain: "acme.nexus.io", members: 24, plan: "Growth", storage: "87%", status: "Active", joined: "Jan 8, 2024" },
    { id: "WS-002", name: "Globex Inc", domain: "globex.nexus.io", members: 8, plan: "Starter", storage: "32%", status: "Active", joined: "Mar 14, 2024" },
    { id: "WS-003", name: "Stark Co", domain: "stark.nexus.io", members: 51, plan: "Enterprise", storage: "96%", status: "Overdue", joined: "Nov 2, 2023" },
    { id: "WS-004", name: "Wayne Inc", domain: "wayne.nexus.io", members: 3, plan: "Starter", storage: "8%", status: "Inactive", joined: "Sep 19, 2024" },
    { id: "WS-005", name: "Umbrella Ltd", domain: "umbrella.nexus.io", members: 17, plan: "Growth", storage: "54%", status: "Active", joined: "Feb 3, 2024" },
    { id: "WS-006", name: "Initech", domain: "initech.nexus.io", members: 6, plan: "Starter", storage: "21%", status: "Active", joined: "Apr 22, 2024" },
    { id: "WS-007", name: "Hooli", domain: "hooli.nexus.io", members: 89, plan: "Enterprise", storage: "73%", status: "Active", joined: "Dec 1, 2023" },
    { id: "WS-008", name: "Pied Piper", domain: "piedpiper.nexus.io", members: 5, plan: "Starter", storage: "11%", status: "Inactive", joined: "Jul 9, 2024" },
    { id: "WS-009", name: "Dunder Mifflin", domain: "dunder.nexus.io", members: 33, plan: "Growth", storage: "61%", status: "Active", joined: "Oct 15, 2023" },
    { id: "WS-010", name: "Vandelay Ind", domain: "vandelay.nexus.io", members: 12, plan: "Growth", storage: "44%", status: "Active", joined: "May 30, 2024" },
    { id: "WS-011", name: "Bluth Co", domain: "bluth.nexus.io", members: 9, plan: "Starter", storage: "19%", status: "Overdue", joined: "Aug 7, 2024" },
    { id: "WS-012", name: "Massive Dynamic", domain: "massive.nexus.io", members: 142, plan: "Enterprise", storage: "88%", status: "Active", joined: "Jan 20, 2024" },
    { id: "WS-013", name: "Soylent Corp", domain: "soylent.nexus.io", members: 7, plan: "Starter", storage: "5%", status: "Inactive", joined: "Jun 11, 2024" },
    { id: "WS-014", name: "Gekko & Co", domain: "gekko.nexus.io", members: 28, plan: "Growth", storage: "70%", status: "Active", joined: "Mar 3, 2024" },
    { id: "WS-015", name: "Prestige World", domain: "prestige.nexus.io", members: 4, plan: "Starter", storage: "3%", status: "Active", joined: "Nov 28, 2023" },
  ];

  const COLUMNS = [
    { key: "name", title: "Workspace", width: "180px" },
    { key: "members", title: "Members", width: "90px", align: "right" as const },
    { key: "plan", title: "Plan", width: "120px" },
    { key: "storage", title: "Storage", width: "130px" },
    { key: "status", title: "Status", width: "120px" },
    { key: "joined", title: "Joined", width: "130px" },
    { key: "domain", title: "Domain", width: "200px" },
    { key: "id", title: "ID", width: "100px" },
  ];

  const tableTotal = ALL_DATA.length;
  const tableTotalPages = Math.ceil(tableTotal / PAGE_SIZE);
  const visibleData = ALL_DATA.slice((tablePage - 1) * PAGE_SIZE, tablePage * PAGE_SIZE);
  const tableRange = usePagination({ page: tablePage, totalPages: tableTotalPages, siblings: 1 });

  const handleTablePageChange = (p: number) => {
    setTablePage(p);
    setSelectedIndices([]);
  };
  const range = usePagination({ page, totalPages, siblings: 1 });
  return showAllIcons ? (
    <AllIconsPage onBack={() => setShowAllIcons(false)} />
  ) : (
    <main>
      {/* FORM COMPONENTS */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-12)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div>
          <h1 className="h1 mb-4">UI Components</h1>
          <p className="body-sm">
            Token-driven design system using brand-setting.css
          </p>
        </div>
        {/* HEADER */}
        <div>
          <h1 className="h1 mb-4">UI Components</h1>
          <p className="body-sm">
            Token-driven design system using brand-setting.css
          </p>

          {/* ADD THIS BUTTON */}
          <Button onClick={() => setShowAllIcons(true)}>
            View All Icons
          </Button>
        </div>
        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-6)",
          }}
        >
          <h2 className="h3">Buttons</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--sp-4)",
            }}
          >
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
          </div>

          <div style={{ display: "flex", gap: "var(--sp-4)" }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">+</Button>
          </div>
        </div>

        {/* INPUTS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-6)",
          }}
        >
          <h2 className="h3">Inputs</h2>

          <Input
            label="Default Input"
            placeholder="Enter your name"
            hint="This is helper text"
          />

          <Input
            label="Error Input"
            placeholder="Invalid email"
            error="Email is required"
          />

          <Input
            label="Success Input"
            placeholder="Success state"
            success="Looks good"
          />

          <Input disabled label="Disabled Input" placeholder="Disabled" />

          <Input
            textarea
            label="Textarea"
            textareaProps={{
              placeholder: "Write your message here...",
              rows: 5,
            }}
            hint="This is a textarea component"
          />
        </div>

        {/* SELECT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-6)",
          }}
        >
          <h2 className="h3">Select</h2>

          <Select label="Select Option" hint="Choose one option">
            <option>Select a value</option>
            <option>React</option>
            <option>Vue</option>
            <option>Angular</option>
          </Select>
        </div>

        {/* CHECKBOXES */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-6)",
          }}
        >
          <h2 className="h3">Checkboxes</h2>

          <Checkboxes
            label="Accept terms"
            checked={checked}
            onChange={setChecked}
          />

          <Checkboxes label="Disabled checkbox" disabled />
        </div>

        {/* TOGGLES */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-6)",
          }}
        >
          <h2 className="h3">Toggles</h2>

          <Toggles
            label="Enable notifications"
            checked={toggle}
            onChange={setToggle}
          />

          <Toggles label="Disabled toggle" disabled />
        </div>
      </section>

      {/* FEEDBACK COMPONENTS */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-8)",
        }}
      >
        <div>
          <h2 className="h2 mb-4">Feedback</h2>
          <p className="body-sm">
            Banner, modal, progress, skeleton, toast, and tooltip components.
          </p>
        </div>

        {/* BANNERS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Banners</h3>

          <Banner
            variant="info"
            title="Information"
            description="This is an informational banner."
          />
          <Banner
            variant="success"
            title="Success"
            description="Operation completed successfully."
          />
          <Banner
            variant="warning"
            title="Warning"
            description="Please review before continuing."
          />
          <Banner
            variant="danger"
            title="Error"
            description="Something went wrong."
          />
        </div>

        {/* PROGRESS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Progress</h3>

          <Progress value={25} label="Uploading" />
          <Progress value={55} variant="success" label="Completed" />
          <Progress value={72} variant="warning" label="Storage Usage" />
          <Progress value={90} variant="danger" label="Critical" />
        </div>

        {/* SKELETON */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Skeleton</h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--sp-3)",
            }}
          >
            <Skeleton width="220px" height="18px" />
            <Skeleton width="100%" height="14px" />
            <Skeleton width="90%" height="14px" />
            <Skeleton width="80%" height="14px" />
            <Skeleton width="120px" height="40px" radius="var(--radius-full)" />
          </div>
        </div>

        {/* TOOLTIP */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Tooltip</h3>

          <div style={{ display: "flex", gap: "var(--sp-4)" }}>
            <Tooltip text="Edit item">
              <Button variant="outline">Hover Me</Button>
            </Tooltip>
            <Tooltip text="Delete permanently">
              <Button variant="destructive">Delete</Button>
            </Tooltip>
          </div>
        </div>

        {/* MODAL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Modal</h3>

          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Delete Project"
            description="This action cannot be undone."
          >
            <p className="body-sm mb-6">
              Are you sure you want to delete this project permanently?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--sp-3)",
              }}
            >
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </Modal>
        </div>

        {/* TOAST */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Toast</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--sp-4)",
            }}
          >
            <Toast
              variant="info"
              position="top-right"
              title="Info"
              description="Top right toast"
            />
            <Toast
              variant="success"
              position="bottom-right"
              title="Success"
              description="Bottom right toast"
            />
            <Toast
              variant="warning"
              position="top-left"
              title="Warning"
              description="Top left toast"
            />
            <Toast
              variant="danger"
              position="bottom-left"
              title="Error"
              description="Bottom left toast"
            />
          </div>
        </div>
      </section>

      {/* TABLE */}
      {/* TABLE */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-6)",
        }}
      >
        <div>
          <h2 className="h2 mb-4">Table</h2>
          <p className="body-sm">
            Compound table with frozen header row, frozen first column,
            striped rows, row selection, and built-in pagination.
          </p>
        </div>

        {selectedIndices.length > 0 && (
          <div style={{
            fontSize: 13,
            color: "var(--brand-400)",
            fontWeight: 500,
            padding: "var(--sp-2) var(--sp-3)",
            background: "var(--brand-50)",
            borderRadius: "var(--radius-md)",
          }}>
            {selectedIndices.length} row{selectedIndices.length > 1 ? "s" : ""} selected
          </div>
        )}

        <Table
          columns={COLUMNS}
          data={visibleData}
          stickyHeader
          stickyFirstColumn
          striped
          hoverable
          selectable
          onSelectionChange={setSelectedIndices}
        >
          <Table.Scroll>
            <Table.Element>
              <Table.Header />
              <Table.Body />
            </Table.Element>
          </Table.Scroll>

          <Table.Footer>
            <Table.PaginationInfo
              page={tablePage}
              pageSize={PAGE_SIZE}
              total={tableTotal}
            />
            <Pagination
              page={tablePage}
              totalPages={tableTotalPages}
              onPageChange={handleTablePageChange}
            >
              <Pagination.Prev />
              <Pagination.List>
                {tableRange.map((item) =>
                  item === "ellipsis-start" || item === "ellipsis-end" ? (
                    <Pagination.Ellipsis key={item} />
                  ) : (
                    <Pagination.Item key={item} page={item} />
                  )
                )}
              </Pagination.List>
              <Pagination.Next />
            </Pagination>
          </Table.Footer>
        </Table>
      </section>

      {/* NAVIGATION */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-8)",
        }}
      >
        <div>
          <h2 className="h2 mb-4">Navigation</h2>
          <p className="body-sm">
            Breadcrumbs, dropdowns, navbar, sidebar, and tabs.
          </p>
        </div>

        {/* BREADCRUMB */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Breadcrumb</h3>

          <Breadcrumb
            items={[
              { label: "Dashboard", href: "#" },
              { label: "Projects", href: "#" },
              { label: "Design System" },
            ]}
          />
        </div>

        {/* DROPDOWN */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Dropdown</h3>

          <Dropdown>
            <Dropdown.Trigger>
              <Button variant="outline">Open Dropdown</Button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Billing</Dropdown.Item>
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>

        {/* NAVBAR */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Navbar</h3>

          <div
            style={{
              overflow: "hidden",
              border: "1px solid var(--neutral-200)",
            }}
          >
            <Navbar variant="bordered">
              <Navbar.Content align="start">
                <Navbar.Brand>
                  MyApp
                </Navbar.Brand>
              </Navbar.Content>

              <Navbar.Content align="center">
                <Navbar.Item>
                  <Navbar.Link active>
                    Dashboard
                  </Navbar.Link>
                </Navbar.Item>

                <Navbar.Item>
                  <Navbar.Link>
                    Projects
                  </Navbar.Link>
                </Navbar.Item>

                <Navbar.Item>
                  <Dropdown>
                    <Dropdown.Trigger>
                      More ▾
                    </Dropdown.Trigger>

                    <Dropdown.Content align="start">
                      <Dropdown.Item>
                        Team
                      </Dropdown.Item>

                      <Dropdown.Item>
                        Analytics
                      </Dropdown.Item>

                      <Dropdown.Item>
                        Reports
                      </Dropdown.Item>

                      <Dropdown.Separator />

                      <Dropdown.Item>
                        Settings
                      </Dropdown.Item>
                    </Dropdown.Content>
                  </Dropdown>
                </Navbar.Item>
              </Navbar.Content>

              <Navbar.Content align="end">
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button variant="outline">
                      Account
                    </Button>
                  </Dropdown.Trigger>

                  <Dropdown.Content align="end">
                    <Dropdown.Label>
                      My Account
                    </Dropdown.Label>

                    <Dropdown.Separator />

                    <Dropdown.Item>
                      Profile
                    </Dropdown.Item>

                    <Dropdown.Item>
                      Billing
                    </Dropdown.Item>

                    <Dropdown.Item>
                      Settings
                    </Dropdown.Item>

                    <Dropdown.Separator />

                    <Dropdown.Item variant="danger">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
              </Navbar.Content>
            </Navbar>
          </div>
        </div>

        {/* SIDEBAR */}
        {/* SIDEBAR — Full width */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Sidebar</h3>
          <div
            style={{
              display: "flex",
              height: "480px",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
            }}
          >
            <SidebarAdapter
              activeItem="Dashboard"
              sections={[
                {
                  label: "Main",
                  items: [
                    { label: "Dashboard", icon: DashboardIcon, active: true },
                    { label: "Workspaces", icon: OrganizationIcon, badge: "1,284" },
                    { label: "Team members", icon: UsersIcon },
                    { label: "Analytics", icon: ChartBarIcon },
                    { label: "Integrations", icon: IntegrationIcon },
                  ],
                },
                {
                  label: "Manage",
                  items: [
                    { label: "Billing", icon: CreditCardIcon },
                    { label: "Security", icon: ShieldIcon },
                    { label: "Settings", icon: SettingsIcon },
                  ],
                },
              ]}
              footer={[
                { label: "Help & support", icon: QuestionCircleIcon },
                { label: "Sign out", icon: LogoutIcon, danger: true },
              ]}
            />
            <main
              style={{
                flex: 1,
                padding: "32px",
                background: "var(--neutral-50)",
                overflowY: "auto",
              }}
            >
              <h1 className="h2" style={{ color: "var(--neutral-700)", marginBottom: "var(--sp-2)" }}>
                Dashboard
              </h1>
              <p className="body-sm" style={{ color: "var(--neutral-400)" }}>
                Welcome back. Here's what's happening today.
              </p>
            </main>
          </div>
        </div>

        {/* SIDEBAR — Collapsed by default */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Collapsed Sidebar</h3>
          <div
            style={{
              display: "flex",
              height: "480px",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
            }}
          >
            <SidebarAdapter
              defaultCollapsed={true}
              sections={[
                {
                  label: "Main",
                  items: [
                    { label: "Dashboard", icon: DashboardIcon, active: true },
                    { label: "Workspaces", icon: OrganizationIcon, badge: "1,284" },
                    { label: "Team members", icon: UsersIcon },
                    { label: "Analytics", icon: ChartBarIcon },
                    { label: "Integrations", icon: IntegrationIcon },
                  ],
                },
                {
                  label: "Manage",
                  items: [
                    { label: "Billing", icon: CreditCardIcon },
                    { label: "Security", icon: ShieldIcon },
                    { label: "Settings", icon: SettingsIcon },
                  ],
                },
              ]}
              footer={[
                { label: "Help & support", icon: QuestionCircleIcon },
                { label: "Sign out", icon: LogoutIcon, danger: true },
              ]}
            />
            <main
              style={{
                flex: 1,
                padding: "32px",
                background: "var(--neutral-50)",
                overflowY: "auto",
              }}
            >
              <h1 className="h2" style={{ color: "var(--neutral-700)", marginBottom: "var(--sp-2)" }}>
                Dashboard
              </h1>
              <p className="body-sm" style={{ color: "var(--neutral-400)" }}>
                Welcome back. Here's what's happening today.
              </p>
            </main>
          </div>
        </div>

        {/* SIDEBAR — Full width */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Sidebar</h3>
          <div
            style={{
              display: "flex",
              height: "480px",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
            }}
          >
            <SidebarAdapter
              activeItem="Dashboard"
              sections={[
                {
                  label: "Main",
                  items: [
                    { label: "Dashboard", icon: DashboardIcon, active: true },
                    { label: "Workspaces", icon: OrganizationIcon, badge: "1,284" },
                    { label: "Team members", icon: UsersIcon },
                    { label: "Analytics", icon: ChartBarIcon },
                    { label: "Integrations", icon: IntegrationIcon },
                  ],
                },
                {
                  label: "Manage",
                  items: [
                    { label: "Billing", icon: CreditCardIcon },
                    { label: "Security", icon: ShieldIcon },
                    { label: "Settings", icon: SettingsIcon },
                  ],
                },
              ]}
              footer={[
                { label: "Help & support", icon: QuestionCircleIcon },
                { label: "Sign out", icon: LogoutIcon, danger: true },
              ]}
            />
            <main
              style={{
                flex: 1,
                padding: "32px",
                background: "var(--neutral-50)",
                overflowY: "auto",
              }}
            >
              <h1 className="h2" style={{ color: "var(--neutral-700)", marginBottom: "var(--sp-2)" }}>
                Dashboard
              </h1>
              <p className="body-sm" style={{ color: "var(--neutral-400)" }}>
                Welcome back. Here's what's happening today.
              </p>
            </main>
          </div>
        </div>

        {/* SIDEBAR — Collapsed by default */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Collapsed Sidebar</h3>
          <div
            style={{
              display: "flex",
              height: "480px",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
            }}
          >
            <SidebarAdapter
              defaultCollapsed={true}
              sections={[
                {
                  label: "Main",
                  items: [
                    { label: "Dashboard", icon: DashboardIcon, active: true },
                    { label: "Workspaces", icon: OrganizationIcon, badge: "1,284" },
                    { label: "Team members", icon: UsersIcon },
                    { label: "Analytics", icon: ChartBarIcon },
                    { label: "Integrations", icon: IntegrationIcon },
                  ],
                },
                {
                  label: "Manage",
                  items: [
                    { label: "Billing", icon: CreditCardIcon },
                    { label: "Security", icon: ShieldIcon },
                    { label: "Settings", icon: SettingsIcon },
                  ],
                },
              ]}
              footer={[
                { label: "Help & support", icon: QuestionCircleIcon },
                { label: "Sign out", icon: LogoutIcon, danger: true },
              ]}
            />
            <main
              style={{
                flex: 1,
                padding: "32px",
                background: "var(--neutral-50)",
                overflowY: "auto",
              }}
            >
              <h1 className="h2" style={{ color: "var(--neutral-700)", marginBottom: "var(--sp-2)" }}>
                Dashboard
              </h1>
              <p className="body-sm" style={{ color: "var(--neutral-400)" }}>
                Welcome back. Here's what's happening today.
              </p>
            </main>
          </div>
        </div>

        {/* SIDEBAR — Compound API with nested children */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Sidebar with nested items</h3>
          <div
            style={{
              display: "flex",
              height: "480px",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
            }}
          >
            {(() => {
              const [collapsed, setCollapsed] = useState(false);
              return (
                <>
                  <Sidebar
                    collapsed={collapsed}
                    onCollapsedChange={setCollapsed}
                    activeItem="Overview"
                  >
                    <Sidebar.Header>
                      <Sidebar.Brand>Nexus</Sidebar.Brand>
                      <Sidebar.Trigger onClick={() => setCollapsed((v) => !v)} />
                    </Sidebar.Header>

                    <Sidebar.Content>
                      <Sidebar.Group label="Main">
                        <Sidebar.Menu>
                          <Sidebar.MenuItem
                            label="Dashboard"
                            icon={DashboardIcon}
                            active
                          />
                          <Sidebar.MenuItem
                            label="Workspaces"
                            icon={OrganizationIcon}
                            badge="1,284"
                          />
                          <Sidebar.MenuItem
                            label="Analytics"
                            icon={ChartBarIcon}
                          >
                            <Sidebar.MenuSubItem label="Overview" active />
                            <Sidebar.MenuSubItem label="Reports" />
                            <Sidebar.MenuSubItem label="Exports" />
                          </Sidebar.MenuItem>
                          <Sidebar.MenuItem
                            label="Integrations"
                            icon={IntegrationIcon}
                          />
                        </Sidebar.Menu>
                      </Sidebar.Group>

                      <Sidebar.Group label="Manage">
                        <Sidebar.Menu>
                          <Sidebar.MenuItem label="Billing" icon={CreditCardIcon} />
                          <Sidebar.MenuItem label="Security" icon={ShieldIcon} />
                          <Sidebar.MenuItem label="Settings" icon={SettingsIcon} />
                        </Sidebar.Menu>
                      </Sidebar.Group>

                      <Sidebar.Footer>
                        <Sidebar.Menu>
                          <Sidebar.MenuItem
                            label="Help & support"
                            icon={QuestionCircleIcon}
                          />
                          <Sidebar.MenuItem
                            label="Sign out"
                            icon={LogoutIcon}
                            danger
                          />
                        </Sidebar.Menu>
                      </Sidebar.Footer>
                    </Sidebar.Content>
                  </Sidebar>

                  <main
                    style={{
                      flex: 1,
                      padding: "32px",
                      background: "var(--neutral-50)",
                      overflowY: "auto",
                    }}
                  >
                    <h1
                      className="h2"
                      style={{
                        color: "var(--neutral-700)",
                        marginBottom: "var(--sp-2)",
                      }}
                    >
                      Overview
                    </h1>
                    <p className="body-sm" style={{ color: "var(--neutral-400)" }}>
                      Analytics overview page.
                    </p>
                  </main>
                </>
              );
            })()}
          </div>
        </div>

        {/* TABS */}
       {(["underline", "default", "pills"] as const).map((variant) => (
  <div key={variant}>
    <p>{variant}</p>
    <Tabs defaultValue="overview" variant={variant}>
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="members" badge={24}>Members</Tabs.Trigger>
        <Tabs.Trigger value="settings" disabled>Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">Overview content</Tabs.Content>
      <Tabs.Content value="members">Members list</Tabs.Content>
    </Tabs>
  </div>
))}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
          <Pagination.Prev />

          <Pagination.List>
            {range.map((item) =>
              item === "ellipsis-start" || item === "ellipsis-end" ? (
                <Pagination.Ellipsis key={item} />
              ) : (
                <Pagination.Item key={item} page={item} />
              )
            )}
          </Pagination.List>

          <Pagination.Next />
        </Pagination>
      </section>
    </main>
  );
}

export default App;