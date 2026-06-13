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
import Sidebar from "./components/ui/Navigation/Sidebar/Sidebar";
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
function App() {
  const [checked, setChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showAllIcons, setShowAllIcons] = useState(false);

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
            Responsive table with sticky header, sticky first column, horizontal
            scroll, hover states, and striped rows.
          </p>
        </div>

        <Table
          stickyHeader
          stickyFirstColumn
          striped
          hoverable
          columns={[
            { key: "name", title: "Name", width: "220px" },
            { key: "email", title: "Email", width: "260px" },
            { key: "role", title: "Role", width: "180px" },
            { key: "status", title: "Status", width: "160px" },
            { key: "team", title: "Team", width: "180px" },
            { key: "country", title: "Country", width: "180px" },
            { key: "created", title: "Created", width: "180px" },
          ]}
          data={[
            {
              name: "Ranjit Singh",
              email: "ranjit@example.com",
              role: "Frontend Developer",
              status: "Active",
              team: "Design System",
              country: "Nepal",
              created: "21 May 2026",
            },
            {
              name: "John Doe",
              email: "john@example.com",
              role: "Backend Engineer",
              status: "Pending",
              team: "API",
              country: "USA",
              created: "18 May 2026",
            },
            {
              name: "Sarah Lee",
              email: "sarah@example.com",
              role: "UI Designer",
              status: "Active",
              team: "Product",
              country: "Canada",
              created: "12 May 2026",
            },
            {
              name: "Aman Verma",
              email: "aman@example.com",
              role: "DevOps",
              status: "Inactive",
              team: "Infrastructure",
              country: "India",
              created: "10 May 2026",
            },
          ]}
        />
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
              borderRadius: "var(--radius-xl)",
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Sidebar</h3>
          <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar
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

            {/* Main content area */}
            <main style={{ flex: 1, padding: "32px", background: "var(--neutral-50)" }}>
              <h1 style={{ color: "var(--neutral-700)" }}>Dashboard</h1>
            </main>
          </div>
        </div>
        {/* COLLAPSED SIDEBAR */}
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
              height: "400px",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
            }}
          >
            <Sidebar
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
              }}
            >
              <h1 style={{ color: "var(--neutral-700)" }}>Dashboard</h1>
            </main>
          </div>

          <h3 className="h4">Collapsed Sidebar</h3>
          <div
            style={{
              display: "flex",
              height: "400px",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
            }}
          >
            <Sidebar
              defaultCollapsed={true}
              sections={[
                {
                  label: "Main",
                  items: [
                    { label: "Dashboard", icon: DashboardIcon },
                    { label: "Workspaces", icon: OrganizationIcon },
                    { label: "Analytics", icon: ChartBarIcon },
                    { label: "Integrations", icon: IntegrationIcon },
                  ],
                },
                {
                  label: "Manage",
                  items: [
                    { label: "Billing", icon: CreditCardIcon },
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
              }}
            >
              <h1 style={{ color: "var(--neutral-700)" }}>Dashboard</h1>
            </main>
          </div>
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-4)",
          }}
        >
          <h3 className="h4">Tabs</h3>


          <Tabs defaultValue="overview" variant="underline">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="members" badge={24}>Members</Tabs.Trigger>
              <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
              <Tabs.Trigger value="api">API</Tabs.Trigger>
              <Tabs.Trigger value="settings" disabled>Settings</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="overview">Overview content</Tabs.Content>
            <Tabs.Content value="members">Members list</Tabs.Content>
            <Tabs.Content value="billing">Billing details</Tabs.Content>
            <Tabs.Content value="api">API keys</Tabs.Content>
          </Tabs>
          <div
            style={{
              padding: "var(--sp-6)",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-xl)",
              background: "var(--neutral-0)",
            }}
          >
            <p className="body">
              Active Tab: <strong>{activeTab}</strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;