package com.github.smartnose

import akka.http.scaladsl.server.Directives._
import com.github.smartnose.api.ParserAPI

trait Routes extends ParserAPI {
  val routes = pathPrefix("v1") {
    parserRoutes
  } ~ path("")(getFromResource("public/index.html"))
}
