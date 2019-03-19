set(NEBULA_EXEC NExec)

# build nebula.exec library
# target_include_directories(${NEBULA_EXEC} INTERFACE src/execution)
add_library(${NEBULA_EXEC} STATIC 
    ${NEBULA_SRC}/execution/ExecutionPlan.cpp    
    ${NEBULA_SRC}/execution/op/Operator.cpp)

target_link_libraries(${NEBULA_EXEC}
    PRIVATE ${FMT_LIBRARY}
    PRIVATE ${NEBULA_COMMON}
    PRIVATE ${NEBULA_SURFACE})

# include its own root directory for searching headers
# set(NEXEC_INCLUDE_DIRS ${NEBULA_SRC}/execution)
# include_directories(include ${NEXEC_INCLUDE_DIRS})

# ask for gflags
include_directories(include ${GFLAGS_INCLUDE_DIRS})

# ask for glog
include_directories(include ${GLOG_INCLUDE_DIRS})

# it depends on fmt
include_directories(include ${FMT_INCLUDE_DIRS})

# it depends on roaring
include_directories(include ${ROARING_INCLUDE_DIRS})

# set up directory to search for headers
include_directories(include ${GTEST_INCLUDE_DIRS})

# build test binary
add_executable(ExecTests
    ${NEBULA_SRC}/execution/test/TestExec.cpp)

target_link_libraries(ExecTests 
    PRIVATE ${GTEST_LIBRARY} 
    PRIVATE ${GTEST_MAIN_LIBRARY} 
    PRIVATE ${FMT_LIBRARY}
    PRIVATE ${ROARING_LIBRARY}
    PRIVATE ${GFLAGS_LIBRARY}
    PRIVATE ${GLOG_LIBRARY}
    PRIVATE ${NEBULA_COMMON}
    PRIVATE ${NEBULA_SURFACE}
    PRIVATE ${NEBULA_EXEC})

# discover all gtests in this module
include(GoogleTest)
gtest_discover_tests(ExecTests TEST_LIST ALL)