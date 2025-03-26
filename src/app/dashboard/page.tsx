import Button from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Welcome to your Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            This is a protected dashboard page. You can start building your
            application here.
          </p>
          <div className="flex gap-4">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Action</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
