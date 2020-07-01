/*
 * Copyright 2017-present Shawn Cao
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#pragma once

#include <folly/Conv.h>

/**
 * Value conversion utility
 */
namespace nebula {
namespace common {

template <typename T, typename S>
T safe_to(const S& s) {
  try {
    return folly::to<T>(s);
  } catch (const std::exception&) {
    return T();
  }
}

} // namespace common
} // namespace nebula