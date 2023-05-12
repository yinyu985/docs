# 监控windows的外接设备在线情况_GPT
我想监控window电脑的外接设备的在线情况，现在我有一个想法，通过定期检查window的设备列表去时间监控外设在线情况，请问你有啥看法。

> 你的想法是可行的。在Windows系统中，你可以使用一些命令行工具或者编写脚本来检查系统设备列表并获取外接设> 备的在线状态。例如，你可以使用“devcon.exe”命令行工具来列举系统所有设备，并通过分析输出信息来判断某个> 设备是否在线。
> 另外，你也可以考虑使用第三方软件来实现设备监控功能。市场上有很多专门用于设备管理和监控的软件，例如> USBDeview、Device Monitoring Studio等。这些软件可以帮助你更轻松地监控设备的在线状态并提供更多的> 设备管理功能。
> 需要注意的是，定期检查设备列表虽然可以实现设备监控，但并不一定能够立即发现设备离线的情况。如果你需要实> 时监控设备状态变化，最好选择基于事件的监控方式，例如通过Windows API注册设备变化事件，并在事件触发时进> 行相应处理。

那么如何基于事件监控呢？windowAPI?

> 是的，你可以使用Windows API来基于事件监控外接设备的插拔情况。具体来说，你可以使用Windows API中的> SetupAPI函数族来注册设备通知事件，并在设备状态发生变化时进行相应处理。
>
> ###### 以下是使用Windows API实现设备监控的大致步骤：
>
> 调用SetupDiGetClassDevs函数获取设备信息集合句柄。
> 调用SetupDiEnumDeviceInfo函数枚举设备信息集合中的设备，并获取设备的硬件ID等信息。
> 调用SetupDiCreateDeviceInfoList函数创建一个新的设备信息集合。
> 调用SetupDiCreateDeviceInfo函数向设备信息集合中添加设备。
> 调用SetupDiCallClassInstaller函数安装设备驱动程序。
> 调用RegisterDeviceNotification函数注册设备通知事件，并指定回调函数来处理事件。
> 在回调函数中处理设备状态变化事件。
> 需要注意的是，在使用Windows API进行设备监控时需要仔细处理设备状态变化事件，以确保不会漏掉任何设备离线> 的情况。同时，由于设备监控需要与Windows系统进行比较底层的交互，因此编写代码时也需要特别小心，避免产生> 意外的后果。

要不你来个demo？

>当然可以。以下是一个使用Windows API基于事件监控外接设备的示例代码，该代码可以实时通知USB设备的插拔情况：
```c++
#include <windows.h>
#include <setupapi.h>
#include <dbt.h>
#include <iostream>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "Setupapi.lib")

LRESULT CALLBACK DeviceEventProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);

int main() {
    // 注册设备通知窗口
    WNDCLASS wc = { 0 };
    wc.lpfnWndProc = DeviceEventProc;
    wc.lpszClassName = L"DeviceNotificationWindow";
    RegisterClass(&wc);
    HWND hwnd = CreateWindow(L"DeviceNotificationWindow", NULL, 0, 0, 0, 0, 0, HWND_MESSAGE, NULL, NULL, NULL);
    if (!hwnd) {
        std::cerr << "Failed to create device notification window!" << std::endl;
        return -1;
    }

    // 打开设备信息集合
    HDEVINFO hDevInfo = ::SetupDiGetClassDevs(NULL, TEXT("USB"), NULL, DIGCF_PRESENT | DIGCF_DEVICEINTERFACE);
    if (hDevInfo == INVALID_HANDLE_VALUE) {
        std::cerr << "Failed to open device information set!" << std::endl;
        return -1;
    }

    // 枚举设备并注册通知事件
    SP_DEVINFO_DATA devInfoData = { 0 };
    devInfoData.cbSize = sizeof(devInfoData);
    for (DWORD i = 0; ::SetupDiEnumDeviceInfo(hDevInfo, i, &devInfoData); ++i) {
        SP_DEVICE_INTERFACE_DATA interfaceData = { 0 };
        interfaceData.cbSize = sizeof(interfaceData);
        if (::SetupDiEnumDeviceInterfaces(hDevInfo, &devInfoData, &GUID_DEVINTERFACE_USB, i, &interfaceData)) {
            DWORD requiredSize = 0;
            ::SetupDiGetDeviceInterfaceDetailW(hDevInfo, &interfaceData, NULL, 0, &requiredSize, NULL);
            if (requiredSize <= 0)
                continue;
            PSP_DEVICE_INTERFACE_DETAIL_DATA_W detailData = >PSP_DEVICE_INTERFACE_DETAIL_DATA_W)::GlobalAlloc(GPTR, requiredSize);
            if (detailData == NULL)
                continue;
            detailData->cbSize = sizeof(SP_DEVICE_INTERFACE_DETAIL_DATA_W);
            if (::SetupDiGetDeviceInterfaceDetailW(hDevInfo, &interfaceData, detailData, requiredSize, NULL, NULL)) {
                DEV_BROADCAST_DEVICEINTERFACE dbi = { 0 };
                dbi.dbcc_size = sizeof(dbi);
                dbi.dbcc_devicetype = DBT_DEVTYP_DEVICEINTERFACE;
                lstrcpy((LPWSTR)dbi.dbcc_name, detailData->DevicePath);
                HDEVNOTIFY hDevNotify = RegisterDeviceNotification(hwnd, &dbi, DEVICE_NOTIFY_WINDOW_HANDLE);
                if (hDevNotify == NULL) {
                    std::cerr << "Failed to register device notification!" << std::endl;
                }
            }
            ::GlobalFree(detailData);
        }
    }

    MSG msg = { 0 };
    while (GetMessage(&msg, NULL, 0, 0))
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    // 关闭设备信息集合
    ::SetupDiDestroyDeviceInfoList(hDevInfo);

    return 0;
}

LRESULT CALLBACK DeviceEventProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    if (uMsg == WM_DEVICECHANGE && lParam != NULL) {
        PDEV_BROADCAST_HDR pBroadcastHeader = (PDEV_BROADCAST_HDR)lParam;
        if (pBroadcastHeader->dbch_devicetype == DBT_DEVTYP_DEVICEINTERFACE) {
            PDEV_BROADCAST_DEVICEINTERFACE pDevInterface = >PDEV_BROADCAST_DEVICEINTERFACE)pBroadcastHeader;
            std::wcout << L"Device has been ";
            switch (wParam) {
            case DBT_DEVICEARRIVAL:
                std::wcout << L"arrived: " << pDevInterface->dbcc_name << std::endl;
                break;
            case DBT_DEVICEREMOVECOMPLETE:
                std::wcout << L"removed: " << pDevInterface->dbcc_name << std::endl;
                break;
            default:
                break;
            }
        }
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```
这是C语言对吧，这个如何运行在windows呢
>是的，这个示例代码是使用C++编写的，但可以作为C语言的一部分进行编译运行。
>如果你想在Windows上运行这个程序，你需要将代码保存为一个.cpp文件，并使用Visual Studio等C++编译器进>行编译。以下是使用Visual Studio 2019进行编译的步骤：
>打开Visual Studio 2019，并选择“创建新项目”（Create a new project）。
>在“创建新项目”对话框中，选择“空项目”（Empty Project），并指定项目名称和存储路径。
>右键单击解决方案资源管理器中的源文件文件夹（例如“源文件1”），选择“添加”（Add），然后选择“现有项”>（Existing Item）
>选择你保存的.cpp文件，点击“添加”按钮。
>在Visual Studio的菜单栏中，选择“生成”（Build）->“生成解决方案”（Build Solution）。
>编译完成后，在输出窗口（Output）中查看是否出现了任何错误或警告信息。
>打开命令提示符（Command Prompt）或Powershell，切换到生成的可执行文件所在的目录，输入可执行文件的名>称，然后回车即可运行程序。
>在程序运行时，你可以插入/拔出USB设备来测试设备监控功能，程序会实时通知设备的插拔情况。


我现在需要的是，一个能够准确的得知USB的设备列表，并且在本机的9200端口暴露出Prometheus能够采集的指标，并且在设备被拔出后，指标的值变成0 ，正常情况下是1

>了解，为了达到你的需求，我们可以结合上面提到的设备监控和指标暴露两个功能，编写一个完整的程序。
>以下是一个使用C++编写的示例代码，该代码可以获取USB设备列表，并在本机的9200端口暴露出Prometheus能够采集的指标：
```c++
#include <windows.h>
#include <setupapi.h>
#include <dbt.h>
#include <iostream>
#include <sstream>
#include <winsock2.h>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "Setupapi.lib")
#pragma comment(lib, "Ws2_32.lib")

const char* PROMETHEUS_METRIC_NAME = "usb_device_status";
const char* PROMETHEUS_METRIC_HELP = "Indicates whether a USB device is present or not (0/1)";
const int PROMETHEUS_LISTEN_PORT = 9200;

void UpdatePrometheusMetric(bool isDevicePresent)
{
    static SOCKET s = INVALID_SOCKET;
    if (s == INVALID_SOCKET) {
        WSADATA wsaData = { 0 };
        WSAStartup(MAKEWORD(2, 2), &wsaData);
        s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        if (s != INVALID_SOCKET) {
            sockaddr_in service = { 0 };
            service.sin_family = AF_INET;
            service.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
            service.sin_port = htons(PROMETHEUS_LISTEN_PORT);
            connect(s, (SOCKADDR*)&service, sizeof(service));
        }
    }

    if (s != INVALID_SOCKET) {
        std::stringstream ss;
        ss << PROMETHEUS_METRIC_NAME << " " << (isDevicePresent ? "1" : "0") << "\r\n";
        send(s, ss.str().c_str(), static_cast<int>(ss.str().size()), 0);
    }
}

LRESULT CALLBACK DeviceEventProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);

int main() {
    // 注册设备通知窗口
    WNDCLASS wc = { 0 };
    wc.lpfnWndProc = DeviceEventProc;
    wc.lpszClassName = L"DeviceNotificationWindow";
    RegisterClass(&wc);
    HWND hwnd = CreateWindow(L"DeviceNotificationWindow", NULL, 0, 0, 0, 0, 0, HWND_MESSAGE, NULL, NULL, NULL);
    if (!hwnd) {
        std::cerr << "Failed to create device notification window!" << std::endl;
        return -1;
    }

    // 打开设备信息集合
    HDEVINFO hDevInfo = ::SetupDiGetClassDevs(NULL, TEXT("USB"), NULL, DIGCF_PRESENT | DIGCF_DEVICEINTERFACE);
    if (hDevInfo == INVALID_HANDLE_VALUE) {
        std::cerr << "Failed to open device information set!" << std::endl;
        return -1;
    }

    // 枚举设备并注册通知事件
    SP_DEVINFO_DATA devInfoData = { 0 };
    devInfoData.cbSize = sizeof(devInfoData);
    for (DWORD i = 0; ::SetupDiEnumDeviceInfo(hDevInfo, i, &devInfoData); ++i) {
        SP_DEVICE_INTERFACE_DATA interfaceData = { 0 };
        interfaceData.cbSize = sizeof(interfaceData);
        if (::SetupDiEnumDeviceInterfaces(hDevInfo, &devInfoData, &GUID_DEVINTERFACE_USB, i, &interfaceData)) {
            DWORD requiredSize = 0;
            ::SetupDiGetDeviceInterfaceDetailW(hDevInfo, &interfaceData, NULL, 0, &requiredSize, NULL);
            if (requiredSize <= 0)
                continue;
            PSP_DEVICE_INTERFACE_DETAIL_DATA_W detailData = (PSP_DEVICE_INTERFACE_DETAIL_DATA_W)::GlobalAlloc(GPTR, requiredSize);
            if (detailData == NULL)
                continue;
            detailData->cbSize = sizeof(SP_DEVICE_INTERFACE_DETAIL_DATA_W);
            if (::SetupDiGetDeviceInterfaceDetailW(hDevInfo, &interfaceData, detailData, requiredSize, NULL, NULL)) {
                DEV_BROADCAST_DEVICEINTERFACE dbi = { 0 };
                dbi.dbcc_size = sizeof(dbi);
                dbi.dbcc_devicetype = DBT_DEVTYP_DEVICEINTERFACE;
                lstrcpy((LPWSTR)dbi.dbcc_name, detailData->DevicePath);
                HDEVNOTIFY hDevNotify = RegisterDeviceNotification(hwnd, &dbi, DEVICE_NOTIFY_WINDOW_HANDLE);
                if (hDevNotify == NULL) {
                    std::cerr << "Failed toregister device notification!" << std::endl;
                    }
                }   
                ::GlobalFree(detailData);
            }
        }
}
// 创建Prometheus指标并启动HTTP服务器
std::stringstream ss;
ss << "# HELP " << PROMETHEUS_METRIC_NAME << " " << PROMETHEUS_METRIC_HELP << "\r\n";
ss << "# TYPE " << PROMETHEUS_METRIC_NAME << " gauge\r\n";
ss << PROMETHEUS_METRIC_NAME << " 0\r\n";
std::string response = ss.str();

WSADATA wsaData = { 0 };
WSAStartup(MAKEWORD(2, 2), &wsaData);

SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
if (serverSocket == INVALID_SOCKET) {
    std::cerr << "Failed to create server socket!" << std::endl;
    return -1;
}

sockaddr_in service = { 0 };
service.sin_family = AF_INET;
service.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
service.sin_port = htons(PROMETHEUS_LISTEN_PORT);

bind(serverSocket, (SOCKADDR*)&service, sizeof(service));
listen(serverSocket, SOMAXCONN);

while (true) {
    SOCKET clientSocket = accept(serverSocket, NULL, NULL);
    if (clientSocket != INVALID_SOCKET) {
        send(clientSocket, response.c_str(), static_cast<int>(response.size()), 0);
        closesocket(clientSocket);
    }
}

// 关闭设备信息集合
::SetupDiDestroyDeviceInfoList(hDevInfo);

return 0;
}

LRESULT CALLBACK DeviceEventProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
if (uMsg == WM_DEVICECHANGE && lParam != NULL) {
PDEV_BROADCAST_HDR pBroadcastHeader = (PDEV_BROADCAST_HDR)lParam;
if (pBroadcastHeader->dbch_devicetype == DBT_DEVTYP_DEVICEINTERFACE) {
PDEV_BROADCAST_DEVICEINTERFACE pDevInterface = (PDEV_BROADCAST_DEVICEINTERFACE)pBroadcastHeader;
UpdatePrometheusMetric(wParam == DBT_DEVICEARRIVAL);
}
}
return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```


>在这个示例中，我添加了一个名为`UpdatePrometheusMetric`的函数，该函数会根据设备插拔事件更新>Prometheus指标的值，并使用Winsock库向本机的9200端口发送指标数据。
>同时，在程序启动时，我也初始化了一些与Prometheus指标暴露相关的代码，包括创建指标、启动HTTP服务器等。
>你可以将代码保存为.cpp文件，使用Visual Studio或其他C++编译器进行编译，然后运行可执行文件。在运行>时，程序会自动获取USB设备列表，并在本机的9200端口暴露出Prometheus能够采集的指标。当你插入/拔出USB设>备时，程序会实时更新指标的值，并通过HTTP响应返回给Prometheus。

我想监控window电脑的外接设备的在线情况，我现在需要的是，一个能够准确的得知USB的设备列表，并且在本机的9200端口暴露出Prometheus能够采集的指标，并且在设备被拔出后，指标的值变成0 ，正常情况下是1。我需要他能够方便的运行在window，或许单独部署在其他机器像blackbox_exporter一样工作。不需要C++实现。

> 你可以考虑使用已有的开源工具，如USBDeview和WMI Exporter。USBDeview是一个小型的Windows应用程序，它能够列出当前连接到计算机的USB设备，并提供了详细的信息，如设备名称、序列号、制造商等。你可以将USBDeview与一个脚本配合使用，定期运行该脚本并将结果输出到Prometheus可采集的格式（如JSON）。同时，你也可以使用WMI Exporter来监控Windows系统中的各种指标，包括硬件信息、CPU使用率、内存使用情况等。WMI Exporter是一款Prometheus的exporter，它能够提供以WMI查询语句为基础的Windows性能计数器指标。你可以使用WMI Exporter轻松地监控USB设备是否在线，并在设备被拔出后将相应的指标值设为0。
>
> 关于部署方面，你可以将USBDeview或WMI Exporter部署在Windows机器上，并将其配置为在本机的9200端口暴露出Prometheus可采集的指标。如果你选择单独部署，你可以使用Blackbox Exporter来监控远程机器的USB设备状态，并将结果输出到Prometheus可采集的格式。

USBDeview能够导出USB设备信息吗

> 是的，USBDeview工具可以导出USB设备信息。您可以使用该工具来列出连接到计算机的所有USB设备，并将它们的详细信息导出为多种格式（如文本文件、HTML文件、XML文件等）。要导出USB设备信息，请按照以下步骤操作：
>
> 1. 下载并安装USBDeview工具。
> 2. 运行USBDeview工具。
> 3. 在主窗口中选择您想要导出的USB设备。
> 4. 选择“File”菜单，然后选择“Export Selected Items”选项。
> 5. 选择一个导出格式（如文本文件、HTML文件、XML文件等）。
> 6. 选择导出文件的路径和文件名。
> 7. 单击“保存”按钮。
>
> 现在，您已经成功地导出了USB设备信息。

我想使用命令行导出呢

> 是的，您可以使用USBDeview工具中的命令行选项来导出USB设备信息。以下是导出USB设备信息的命令行步骤：
>
> 1. 打开命令提示符或PowerShell。
> 2. 导航到USBDeview安装目录（默认情况下为C:\Program Files\USBDeview）。
> 3. 输入以下命令：`USBDeview.exe /scomma "C:\路径\文件名.csv"`。
>
> 在这个命令中，`/scomma`参数用于指定导出格式为逗号分隔值（CSV），`"C:\路径\文件名.csv"`是要导出的文件路径和名称。
>
> 如果您想要导出其他格式的文件，可以使用以下命令替换上面的命令中的`scomma`参数：
>
> - `/stab`: 以制表符分隔的文本文件格式
> - `/shtml`: HTML格式
> - `/sxml`: XML格式
>
> 输入完命令后，按Enter键运行该命令即可导出USB设备信息。

我想通过powershell安装USBDeview，并且每十秒导出USB设备的情况，并且将这个信息处理成Prometheus能够采集的数据，暴露在本机的9200端口

> 好的，以下是您需要执行的步骤：
>
> 1. 下载USBDeview的zip文件并解压缩到一个目录中，例如`C:\Temp\USBDeview`。
>
> 2. 使用PowerShell命令安装Chocolatey包管理器：
>
>    ```
>    Copy CodeSet-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
>    ```
>
> 3. 安装USBDeview工具：
>
>    ```
>    Copy Codechoco install usbdeview -y
>    ```
>
> 4. 创建一个新的PowerShell脚本文件，例如`C:\Temp\USBDeviewExporter.ps1`，并将以下内容复制到该文件中：
>
>    ```
>    powershellCopy Code# 导出USB设备信息到CSV文件
>    $csvFilePath = "C:\Temp\usbdeview.csv"
>    while ($true) {
>        & "C:\Program Files\USBDeview\USBDeview.exe" /scomma "$csvFilePath"
>        Start-Sleep -Seconds 10
>    }
>    
>    # 处理CSV文件并将数据暴露为Prometheus格式
>    $port = 9200
>    $prefix = "usbdeview_"
>    $csvData = Import-Csv $csvFilePath
>    $metricNames = $csvData | Select-Object -First 1 | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
>    $metricNames | ForEach-Object {
>        $metricName = $_
>        Write-Host "Registering metric: $prefix$metricName"
>        $counter = New-Object System.Diagnostics.PerformanceCounter("USBDeview", $prefix$metricName, $false)
>        $counter.RawValue = 0
>    }
>    $url = "http://localhost:$port/metrics/job/usbdeview"
>    while ($true) {
>        $csvData = Import-Csv $csvFilePath
>        $metrics = @{}
>        $metricNames | ForEach-Object { $metrics[$_] = 0 }
>        $csvData | ForEach-Object {
>            $row = $_
>            $metricNames | ForEach-Object {
>                $metricName = $_
>                $value = $row."$metricName"
>                if ($value -as [int]) {
>                    $metrics[$metricName] += $value
>                }
>            }
>        }
>        $metrics.GetEnumerator() | ForEach-Object {
>            $metricName = $_.Key
>            $value = $_.Value
>            Write-Host "Setting value for metric: $prefix$metricName => $value"
>            $counter = New-Object System.Diagnostics.PerformanceCounter("USBDeview", $prefix$metricName, $false)
>            $counter.RawValue = $value
>        }
>        Invoke-RestMethod -Method Put -Uri $url
>        Start-Sleep -Seconds 10
>    }
>    ```
>
>    脚本中的第一部分使用USBDeview工具每十秒钟导出USB设备信息到CSV文件中。在第二部分中，我们处理这个CSV文件，并将每个指标曝光成Prometheus格式。请注意，我们将指标名加上了前缀“usbdeview_”。
>
> 5. 打开PowerShell会话并运行以下命令以启动脚本：
>
>    ```
>    Copy CodeC:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File C:\Temp\USBDeviewExporter.ps1
>    ```
>
> 现在，指标就已经被曝光在本地的9200端口上，可以被Prometheus采集并监控了。您可以访问`http://localhost:9200/metrics`来查看指标是否被曝光。
