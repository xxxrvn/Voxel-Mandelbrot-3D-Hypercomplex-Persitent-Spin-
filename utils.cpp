#include "utils.h"
#include <filesystem>
#include <iostream>
#include <windows.h>


std::string utils::GetExeDirectory()
{

    wchar_t szPath[MAX_PATH];
    GetModuleFileNameW( NULL, szPath, MAX_PATH );

    return (std::filesystem::path{ szPath }.parent_path() / "").generic_string();;
}
