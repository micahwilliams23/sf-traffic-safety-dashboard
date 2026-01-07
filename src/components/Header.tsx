import type { AllCrashes } from "@/types/data";
import { LinkExternal02 } from "@untitledui/icons";

export default function Header({ allCrashes }: { allCrashes: AllCrashes[] }) {
  const latestCrash = allCrashes.length > 0 ? allCrashes[0].datetime : new Date();


  return (
    <div className="flex justify-between">
      <div className="flex">
        {/* <img className="h-20 object-scale-down" src="https://images.squarespace-cdn.com/content/v1/634e1243add7446ca0901f58/1666061023451-5RLS1J6EJBK90M2VFX4X/logo-square.png?format=1500w" /> */}
        <div className="mx-4">
          <h1 className="mb-1">SF Traffic Safety Dashboard</h1>
          <div className="flex justify-between">
            <div className="flex">
              <h5 className="mr-2">Data Source:</h5>
              <a href="https://data.sfgov.org/Public-Safety/Traffic-Crashes-Resulting-in-Injury/ubvf-ztfx/">
                <div className="flex content-center">
                  <h5>Traffic Crashes Resulting in Injury, DataSF</h5>
                  <LinkExternal02 className="mx-2 my-auto h-4" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      {allCrashes.length === 0 ? <></> :
        <div className="flex">
          <div className="content-end text-end bottom-0 text-sm">
            Latest reported crash: {latestCrash?.toLocaleDateString("en-US", { dateStyle: "medium" } as Intl.DateTimeFormatOptions)}
            <p className="text-gray-500 text-xs">
              New injuries are reported quarterly.
            </p>
          </div>
        </div>
      }
    </div>
  );
}
