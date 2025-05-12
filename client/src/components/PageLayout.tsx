import { Outlet } from 'react-router-dom';

interface PageLayoutProps {
  title: string;
  children?: React.ReactNode;
}

export const PageLayout = ({ title, children }: PageLayoutProps) => {
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="p-4 mb-4 rounded-3 bg-teal-light">
            <h1 className="text-center mb-4">{title}</h1>
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
