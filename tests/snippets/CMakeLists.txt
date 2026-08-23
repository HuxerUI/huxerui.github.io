cmake_minimum_required(VERSION 3.20)

project(huxerui_documentation_snippets LANGUAGES CXX)

if (NOT HUXERUI_SOURCE_DIR)
    message(FATAL_ERROR "HUXERUI_SOURCE_DIR must point to the documented HuxerUI checkout")
endif ()

add_library(huxerui_documentation_snippets OBJECT docs_snippets.cpp)
target_compile_features(huxerui_documentation_snippets PRIVATE cxx_std_20)
target_include_directories(huxerui_documentation_snippets PRIVATE "${HUXERUI_SOURCE_DIR}/include")
set_target_properties(huxerui_documentation_snippets PROPERTIES CXX_EXTENSIONS OFF)

if (MSVC)
    target_compile_options(huxerui_documentation_snippets PRIVATE /wd5030)
else ()
    target_compile_options(huxerui_documentation_snippets PRIVATE -Wno-attributes)
endif ()
