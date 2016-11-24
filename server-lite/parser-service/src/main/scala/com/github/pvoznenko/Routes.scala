package com.github.pvoznenko

import akka.http.scaladsl.server.Directives._
import com.github.pvoznenko.api.ParserAPI

trait Routes extends ParserAPI {
  val routes = pathPrefix("v1") {
    parserRoutes
  } ~ path("")(getFromResource("public/index.html"))
}
